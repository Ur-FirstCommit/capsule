"use server";

import { createClient } from "@/lib/supabase/server";
import { capsuleSchema } from "@/lib/validation";
import { redirect } from "next/navigation";

export type CapsuleActionState = { ok: boolean; error?: string; id?: string; unlockAt?: string };

export async function createCapsule(_previousState: CapsuleActionState, formData: FormData): Promise<CapsuleActionState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Your session expired. Please sign in again." };
  const parsed = capsuleSchema.safeParse({ title: formData.get("title"), message: formData.get("message"), unlockAt: formData.get("unlockAt"), additionalNotes: formData.get("additionalNotes") || undefined });
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message || "Check your details and try again." };
  if (new Date(parsed.data.unlockAt).getTime() <= Date.now()) return { ok: false, error: "Choose a date in the future." };
  const { data: id, error } = await supabase.rpc("create_capsule", { p_title: parsed.data.title, p_message: parsed.data.message, p_unlock_at: parsed.data.unlockAt, p_additional_notes: parsed.data.additionalNotes || null });
  if (error?.code === "PGRST202") {
    // Existing projects may not have migration 0002 yet. Keep creation usable while the migration is applied.
    const { data: capsule, error: capsuleError } = await supabase.from("capsules").insert({ user_id: user.id, title: parsed.data.title, unlock_at: parsed.data.unlockAt }).select("id").single();
    if (capsuleError || !capsule) { console.error("[Capsule Creation]", { userId: user.id, operation: "insert capsules", status: capsuleError?.code, error: capsuleError?.message }); return { ok: false, error: "We couldn't create your Capsule. Please try again." }; }
    const { error: contentError } = await supabase.from("capsule_contents").insert({ capsule_id: capsule.id, user_id: user.id, message: parsed.data.message, additional_notes: parsed.data.additionalNotes || null });
    if (contentError) { await supabase.from("capsules").delete().eq("id", capsule.id); console.error("[Capsule Creation]", { userId: user.id, operation: "insert capsule_contents", status: contentError.code, error: contentError.message }); return { ok: false, error: "We couldn't create your Capsule. Please try again." }; }
    return { ok: true, id: capsule.id, unlockAt: parsed.data.unlockAt };
  }
  if (error || !id) { console.error("[Capsule Creation]", { userId: user.id, operation: "create_capsule", status: error?.code, error: error?.message }); return { ok: false, error: "We couldn't create your Capsule. Please try again." }; }
  return { ok: true, id: String(id), unlockAt: parsed.data.unlockAt };
}

export async function openCapsule(id: string): Promise<void> { const supabase = await createClient(); const { data: opened, error } = await supabase.rpc("open_capsule", { capsule_uuid: id }); if (error || !opened) redirect(`/dashboard/${id}?error=${encodeURIComponent("This capsule is not ready to open yet.")}`); redirect(`/dashboard/${id}`); }
export async function signOut() { const supabase = await createClient(); await supabase.auth.signOut(); redirect("/"); }
