import React from "react";
import ContactSection from "@/components/home/ContactSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Start a Project — Moon 3D Studio",
  description:
    "Submit your 3D asset project brief. We review requirements, polygon budgets, references, and provide detailed production proposals within 24 hours.",
};

export default function ContactPage() {
  return (
    <div className="pt-16 bg-[#090a0d] min-h-screen">
      <ContactSection />
    </div>
  );
}
