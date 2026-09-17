import { z } from "zod";

/**
 * Public Contact / Project Enquiry Validation Schema
 */
export const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters"),
  email: z
    .string()
    .trim()
    .email("Please provide a valid email address")
    .max(150, "Email must not exceed 150 characters"),
  company: z
    .string()
    .trim()
    .max(100, "Company name must not exceed 100 characters")
    .optional()
    .or(z.literal("")),
  projectType: z
    .string()
    .trim()
    .max(200, "Project type description is too long")
    .optional()
    .default("General 3D Inquiry"),
  timeline: z
    .string()
    .trim()
    .max(100)
    .optional()
    .default("Flexible"),
  budget: z
    .string()
    .trim()
    .max(100)
    .optional()
    .default("$1000 - $3000"),
  description: z
    .string()
    .trim()
    .min(5, "Please provide some project details (minimum 5 characters)")
    .max(5000, "Project description must not exceed 5000 characters"),
  referenceUrl: z
    .string()
    .trim()
    .url("Reference URL must be a valid URL")
    .max(500)
    .optional()
    .or(z.literal("")),
  // Honeypot field: must be empty if submitted by a human
  website_hp: z.string().optional().or(z.literal("")),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

/**
 * Admin Login Validation Schema
 */
export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Enquiry Status Update Schema
 */
export const enquiryStatusSchema = z.object({
  status: z.enum([
    "NEW",
    "CONTACTED",
    "IN_PROGRESS",
    "COMPLETED",
    "ARCHIVED",
    "SPAM",
  ]),
});

export const projectImageInputSchema = z.object({
  id: z.string().optional(),
  url: z.string().trim().min(1, "Image URL is required"),
  altText: z.string().trim().optional().or(z.literal("")),
  caption: z.string().trim().optional().or(z.literal("")),
  sortOrder: z.number().int().default(0),
  imageType: z.string().trim().default("DETAIL"),
});

export type ProjectImageInput = z.infer<typeof projectImageInputSchema>;

/**
 * Project Form Schema (Admin CMS)
 */
export const projectSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Project title must be at least 2 characters")
    .max(150, "Project title must not exceed 150 characters"),
  slug: z
    .string()
    .trim()
    .min(2, "URL slug must be at least 2 characters")
    .max(150, "URL slug must not exceed 150 characters")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  shortDescription: z
    .string()
    .trim()
    .min(5, "Short overview description must be at least 5 characters")
    .max(300, "Short overview description must not exceed 300 characters"),
  description: z
    .string()
    .trim()
    .min(10, "Detailed case study description must be at least 10 characters"),
  category: z.enum(["VEHICLES", "HARD SURFACE", "ENVIRONMENT", "OTHER"]),
  categoryLabel: z
    .string()
    .trim()
    .min(2, "Category label must be at least 2 characters")
    .max(50),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
  heroImage: z
    .string()
    .trim()
    .min(1, "Hero Image / Video Cover is required. Please upload or choose a cover image."),
  thumbnailImage: z.string().trim().optional().or(z.literal("")),
  client: z.string().trim().max(100).optional().or(z.literal("")),
  year: z.string().trim().max(10).default(new Date().getFullYear().toString()),
  triangles: z.string().trim().max(50).optional().or(z.literal("")),
  textureResolution: z.string().trim().max(100).optional().or(z.literal("")),
  engine: z.string().trim().max(100).optional().or(z.literal("")),
  software: z.array(z.string()).default([]),
  services: z.array(z.string()).default([]),
  actionText: z.string().trim().max(50).optional().or(z.literal("")),
  seoTitle: z.string().trim().max(150).optional().or(z.literal("")),
  seoDescription: z.string().trim().max(300).optional().or(z.literal("")),
  ogImage: z.string().trim().optional().or(z.literal("")),
  images: z.array(projectImageInputSchema).optional().default([]),
});

export type ProjectInput = z.infer<typeof projectSchema>;

/**
 * Service Form Schema (Admin CMS)
 */
export const serviceSchema = z.object({
  id: z.string().trim().min(2, "Service ID must be at least 2 characters").max(100),
  title: z.string().trim().min(2, "Service title must be at least 2 characters").max(100),
  slug: z
    .string()
    .trim()
    .min(2, "URL slug must be at least 2 characters")
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  shortDesc: z.string().trim().min(5, "Short description must be at least 5 characters").max(300),
  fullDesc: z.string().trim().min(10, "Full description must be at least 10 characters"),
  iconName: z.enum(["box", "gamepad", "car", "shield", "sparkles", "layers"]).default("box"),
  highlights: z.array(z.string()).default([]),
  deliverables: z.array(z.string()).default([]),
  published: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
  heroImage: z.string().trim().optional().or(z.literal("")),
  seoTitle: z.string().trim().max(150).optional().or(z.literal("")),
  seoDescription: z.string().trim().max(300).optional().or(z.literal("")),
});

export type ServiceInput = z.infer<typeof serviceSchema>;

/**
 * Testimonial Form Schema (Admin CMS)
 */
export const testimonialSchema = z.object({
  clientName: z.string().trim().min(2, "Client name must be at least 2 characters").max(100),
  company: z.string().trim().max(100).optional().or(z.literal("")),
  quote: z.string().trim().min(5, "Testimonial quote must be at least 5 characters").max(1000),
  project: z.string().trim().max(100).optional().or(z.literal("")),
  image: z.string().trim().optional().or(z.literal("")),
  published: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

export type TestimonialInput = z.infer<typeof testimonialSchema>;
