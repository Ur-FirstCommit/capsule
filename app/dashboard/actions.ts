"use server";

import { createClient } from "@/lib/supabase/server";
import { capsuleSchema } from "@/lib/validation";
import { redirect } from "next/navigation";

export type CapsuleActionState = { ok: boolean; error?: string; id?: string; unlockAt?: string };

export async function createCapsule(_previousState: CapsuleActionState, formData: FormData): Promise<CapsuleActionState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Your session expired. Please sign in again." };
  const parsed = capsuleSchema.safeParse({ title: formData.get("title"), message: formData.get("message"), unlockAt: formData.get("unlockAt"), projectName: formData.get("projectName") || undefined, websiteUrl: formData.get("websiteUrl") || "", githubUrl: formData.get("githubUrl") || "", additionalNotes: formData.get("additionalNotes") || undefined });
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message || "Check your details and try again." };
  if (new Date(parsed.data.unlockAt).getTime() <= Date.now()) return { ok: false, error: "Choose a date in the future." };
  const { data: id, error } = await supabase.rpc("create_capsule", { p_title: parsed.data.title, p_message: parsed.data.message, p_unlock_at: parsed.data.unlockAt, p_project_name: parsed.data.projectName || null, p_website_url: parsed.data.websiteUrl || null, p_github_url: parsed.data.githubUrl || null, p_additional_notes: parsed.data.additionalNotes || null });
  if (error || !id) { console.error("[Capsule Creation]", { userId: user.id, operation: "create_capsule", status: error?.code, error: error?.message }); return { ok: false, error: "We couldn't create your Capsule. Please try again." }; }
  return { ok: true, id: String(id), unlockAt: parsed.data.unlockAt };
}

export async function openCapsule(id: string): Promise<void> { const supabase = await createClient(); const { data: opened, error } = await supabase.rpc("open_capsule", { capsule_uuid: id }); if (error || !opened) redirect(`/dashboard/${id}?error=${encodeURIComponent("This capsule is not ready to open yet.")}`); redirect(`/dashboard/${id}`); }
export async function signOut() { const supabase = await createClient(); await supabase.auth.signOut(); redirect("/"); }
