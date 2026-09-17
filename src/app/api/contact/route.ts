import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { contactFormSchema } from "@/lib/validations";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { savePrivateFile, validateUploadFile } from "@/lib/storage";
import { sendEnquiryNotificationToAdmin, sendConfirmationToClient } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    // 1. Rate Limiting: Max 5 submissions per 10 minutes per IP
    const clientIp = getClientIp(req);
    const rateLimit = checkRateLimit(`contact_${clientIp}`, 5, 10 * 60 * 1000);
    if (!rateLimit.success) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many submissions from your IP. Please wait ${rateLimit.reset} seconds before trying again.`,
        },
        { status: 429 }
      );
    }

    // 2. Parse Multipart Form Data
    const formData = await req.formData();
    const rawData = {
      name: formData.get("name")?.toString() || "",
      email: formData.get("email")?.toString() || "",
      company: formData.get("company")?.toString() || "",
      projectType: formData.get("projectType")?.toString() || "General 3D Inquiry",
      timeline: formData.get("timeline")?.toString() || "Flexible",
      budget: formData.get("budget")?.toString() || "$1000 - $3000",
      description: formData.get("description")?.toString() || "",
      referenceUrl: formData.get("referenceUrl")?.toString() || "",
      website_hp: formData.get("website_hp")?.toString() || "",
    };

    // 3. Honeypot check: silently ignore bots
    if (rawData.website_hp && rawData.website_hp.trim().length > 0) {
      console.warn(`[Spam Detected] Honeypot triggered by IP: ${clientIp}`);
      return NextResponse.json({ success: true });
    }

    // 4. Server-Side Validation
    const validationResult = contactFormSchema.safeParse(rawData);
    if (!validationResult.success) {
      const firstError = validationResult.error.issues?.[0]?.message || "Invalid input data.";
      return NextResponse.json(
        { success: false, error: firstError },
        { status: 400 }
      );
    }

    const validData = validationResult.data;

    // 5. File Uploads Validation
    const rawFiles = formData.getAll("files");
    const validFilesToUpload: File[] = [];

    for (const item of rawFiles) {
      if (item instanceof File && item.size > 0) {
        const fileCheck = await validateUploadFile(item);
        if (!fileCheck.valid) {
          return NextResponse.json(
            { success: false, error: fileCheck.error || "Invalid file uploaded." },
            { status: 400 }
          );
        }
        validFilesToUpload.push(item);
      }
    }

    // Limit maximum attached files to 10
    if (validFilesToUpload.length > 10) {
      return NextResponse.json(
        { success: false, error: "Maximum 10 files can be attached per enquiry." },
        { status: 400 }
      );
    }

    // 6. Save Enquiry to Database
    const enquiry = await prisma.projectEnquiry.create({
      data: {
        name: validData.name,
        email: validData.email,
        company: validData.company || null,
        projectType: validData.projectType || "General 3D",
        description: validData.description,
        timeline: validData.timeline || "Within 1 Month",
        budget: validData.budget || "$1000 - $3000",
        referenceUrl: validData.referenceUrl || null,
        status: "NEW",
      },
    });

    // 7. Store Files in Secure Private Storage
    for (const file of validFilesToUpload) {
      try {
        const storedInfo = await savePrivateFile(file);
        await prisma.enquiryAttachment.create({
          data: {
            enquiryId: enquiry.id,
            originalName: storedInfo.originalName,
            storageKey: storedInfo.storageKey,
            mimeType: storedInfo.mimeType,
            size: storedInfo.size,
          },
        });
      } catch (fileErr) {
        console.error(`[Storage Error] Failed to store file "${file.name}":`, fileErr);
      }
    }

    // 8. Trigger Email Notifications (non-blocking for resilience)
    const emailPayload = {
      name: validData.name,
      email: validData.email,
      company: validData.company,
      projectType: validData.projectType,
      description: validData.description,
      timeline: validData.timeline,
      budget: validData.budget,
      referenceUrl: validData.referenceUrl,
      attachmentsCount: validFilesToUpload.length,
    };

    // Run emails without breaking request if SMTP/Resend is unreachable
    Promise.allSettled([
      sendEnquiryNotificationToAdmin(emailPayload),
      sendConfirmationToClient(emailPayload),
    ]).catch((err) => {
      console.error("[Email Notification Warning]", err);
    });

    return NextResponse.json({
      success: true,
      message: "Your project enquiry has been submitted successfully.",
      enquiryId: enquiry.id,
    });
  } catch (error) {
    console.error("[Contact API Error]:", error);
    return NextResponse.json(
      { success: false, error: "Something went wrong while processing your enquiry. Please try again." },
      { status: 500 }
    );
  }
}
