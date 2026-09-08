import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  RESEND_API_KEY: z.string().min(1).optional(),
  RESEND_FROM_EMAIL: z.string().email().optional(),
  RESEND_FROM_NAME: z.string().min(1).default("Capsule by FirstCommit"),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  CRON_SECRET: z.string().min(20).optional(),
  ADMIN_EMAILS: z.string().optional(),
});

export function getEnv() {
  const result = envSchema.safeParse(process.env);
  if (!result.success) throw new Error("Capsule is not configured. Check the required environment variables.");
  return result.data;
}

export function isAdminEmail(email: string | undefined) {
  const configured = getEnv().ADMIN_EMAILS;
  if (!email || !configured) return false;
  return configured.split(",").map((value) => value.trim().toLowerCase()).filter(Boolean).includes(email.toLowerCase());
}

export function requireServerEnv() {
  const env = getEnv();
  if (!env.SUPABASE_SERVICE_ROLE_KEY) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY server configuration.");
  return env as typeof env & { SUPABASE_SERVICE_ROLE_KEY: string };
}

export function requireEmailEnv() {
  const env = getEnv();
  if (!env.RESEND_API_KEY || !env.RESEND_FROM_EMAIL || !env.CRON_SECRET) throw new Error("Missing Resend or cron server configuration.");
  return env as typeof env & { RESEND_API_KEY: string; RESEND_FROM_EMAIL: string; CRON_SECRET: string };
}
