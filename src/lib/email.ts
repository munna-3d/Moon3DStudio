/**
 * Transactional Email Service for Moon 3D Studio
 * Supports Resend API with automatic graceful development fallback
 */

interface EnquiryEmailParams {
  name: string;
  email: string;
  company?: string | null;
  projectType?: string | null;
  description: string;
  timeline?: string | null;
  budget?: string | null;
  referenceUrl?: string | null;
  attachmentsCount?: number;
}

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "contact@moon3dstudio.com";
const RESEND_API_KEY = process.env.RESEND_API_KEY || process.env.EMAIL_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || "Moon 3D Studio <notifications@moon3dstudio.com>";

/**
 * Send email via Resend API or log to server console
 */
async function sendRawEmail({
  to,
  subject,
  html,
  replyTo,
}: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<boolean> {
  if (RESEND_API_KEY) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to,
          subject,
          html,
          reply_to: replyTo,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error("[Email Error] Resend API responded with error:", errText);
        return false;
      }
      return true;
    } catch (err) {
      console.error("[Email Error] Failed to connect to email provider:", err);
      return false;
    }
  } else {
    // Development / No-key fallback: log email contents to console
    console.log("==================================================");
    console.log(`[EMAIL DISPATCH - DEV SIMULATION]`);
    console.log(`To: ${to}`);
    console.log(`Reply-To: ${replyTo || "none"}`);
    console.log(`Subject: ${subject}`);
    console.log("--------------------------------------------------");
    console.log(html.replace(/<[^>]+>/g, " ").trim());
    console.log("==================================================");
    return true;
  }
}

/**
 * Send new project enquiry notification to Studio Owner / Admin
 */
export async function sendEnquiryNotificationToAdmin(enquiry: EnquiryEmailParams): Promise<boolean> {
  const subject = `New Project Enquiry — Moon 3D Studio (${enquiry.name})`;

  const html = `
    <!DOCTYPE html>
    <html>
      <body style="font-family: Arial, sans-serif; background-color: #090a0d; color: #ffffff; padding: 24px;">
        <div style="max-width: 600px; margin: 0 auto; background: #11141a; border: 1px solid #222733; border-radius: 8px; padding: 24px;">
          <h2 style="color: #d4ff00; margin-top: 0; font-size: 20px; text-transform: uppercase;">
            New Project Enquiry
          </h2>
          <p style="color: #a1a1aa; font-size: 14px;">A new brief has been submitted through the studio website.</p>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 14px;">
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #1f2430; color: #a1a1aa; width: 140px;">Client Name:</td>
              <td style="padding: 8px; border-bottom: 1px solid #1f2430; color: #ffffff; font-weight: bold;">${enquiry.name}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #1f2430; color: #a1a1aa;">Email:</td>
              <td style="padding: 8px; border-bottom: 1px solid #1f2430; color: #d4ff00;"><a href="mailto:${enquiry.email}" style="color: #d4ff00; text-decoration: none;">${enquiry.email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #1f2430; color: #a1a1aa;">Company:</td>
              <td style="padding: 8px; border-bottom: 1px solid #1f2430; color: #ffffff;">${enquiry.company || "Not provided"}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #1f2430; color: #a1a1aa;">Project Type:</td>
              <td style="padding: 8px; border-bottom: 1px solid #1f2430; color: #ffffff;">${enquiry.projectType || "General 3D"}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #1f2430; color: #a1a1aa;">Timeline:</td>
              <td style="padding: 8px; border-bottom: 1px solid #1f2430; color: #ffffff;">${enquiry.timeline || "Flexible"}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #1f2430; color: #a1a1aa;">Estimated Budget:</td>
              <td style="padding: 8px; border-bottom: 1px solid #1f2430; color: #ffffff;">${enquiry.budget || "Not specified"}</td>
            </tr>
            ${
              enquiry.referenceUrl
                ? `
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #1f2430; color: #a1a1aa;">Reference URL:</td>
              <td style="padding: 8px; border-bottom: 1px solid #1f2430;"><a href="${enquiry.referenceUrl}" target="_blank" style="color: #d4ff00;">${enquiry.referenceUrl}</a></td>
            </tr>`
                : ""
            }
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #1f2430; color: #a1a1aa;">Attached Files:</td>
              <td style="padding: 8px; border-bottom: 1px solid #1f2430; color: #ffffff;">${enquiry.attachmentsCount || 0} file(s)</td>
            </tr>
          </table>

          <div style="margin-top: 20px;">
            <h4 style="color: #a1a1aa; font-size: 13px; text-transform: uppercase; margin-bottom: 6px;">Project Description:</h4>
            <div style="background: #090a0d; padding: 14px; border-radius: 6px; border: 1px solid #1f2430; font-size: 14px; line-height: 1.6; white-space: pre-wrap; color: #e4e4e7;">
              ${enquiry.description}
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendRawEmail({
    to: ADMIN_EMAIL,
    subject,
    html,
    replyTo: enquiry.email,
  });
}

/**
 * Send automated professional receipt confirmation to the Client
 */
export async function sendConfirmationToClient(enquiry: EnquiryEmailParams): Promise<boolean> {
  const subject = "We received your project enquiry — Moon 3D Studio";

  const html = `
    <!DOCTYPE html>
    <html>
      <body style="font-family: Arial, sans-serif; background-color: #090a0d; color: #ffffff; padding: 24px;">
        <div style="max-width: 600px; margin: 0 auto; background: #11141a; border: 1px solid #222733; border-radius: 8px; padding: 24px;">
          <h2 style="color: #d4ff00; margin-top: 0; font-size: 20px; text-transform: uppercase;">
            Moon 3D Studio
          </h2>
          <p style="font-size: 16px; color: #ffffff;">Hello ${enquiry.name},</p>
          <p style="font-size: 14px; color: #a1a1aa; line-height: 1.6;">
            Thank you for reaching out to Moon 3D Studio regarding your 3D asset production requirements.
          </p>
          <p style="font-size: 14px; color: #a1a1aa; line-height: 1.6;">
            We have securely received your project details and references. Our lead artists will review your specifications, polygon budgets, and references.
          </p>
          <p style="font-size: 14px; color: #a1a1aa; line-height: 1.6;">
            If you have additional design documentation or urgent deadlines, you can reply directly to this email.
          </p>
          <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #1f2430; font-size: 12px; color: #71717a;">
            Moon 3D Studio — 3D Game Art & Asset Production<br />
            <a href="https://moon3dstudio.com" style="color: #d4ff00; text-decoration: none;">moon3dstudio.com</a>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendRawEmail({
    to: enquiry.email,
    subject,
    html,
  });
}
