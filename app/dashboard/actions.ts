"use server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { capsuleSchema } from "@/lib/validation";

export async function createCapsule(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const parsed = capsuleSchema.safeParse({ title: formData.get("title"), message: formData.get("message"), unlockAt: formData.get("unlockAt"), projectName: formData.get("projectName") || undefined, websiteUrl: formData.get("websiteUrl") || "", githubUrl: formData.get("githubUrl") || "", additionalNotes: formData.get("additionalNotes") || undefined });
  if (!parsed.success) redirect(`/dashboard/new?error=${encodeURIComponent(parsed.error.issues[0]?.message || "Check your details")}`);
  if (new Date(parsed.data.unlockAt).getTime() <= Date.now()) redirect(`/dashboard/new?error=${encodeURIComponent("Choose a date in the future")}`);
  const { data: capsule, error } = await supabase.from("capsules").insert({ user_id: user.id, title: parsed.data.title, unlock_at: parsed.data.unlockAt }).select("id").single();
  if (error || !capsule) redirect(`/dashboard/new?error=${encodeURIComponent("Could not seal your capsule. Try again.")}`);
  const { error: contentError } = await supabase.from("capsule_contents").insert({ capsule_id: capsule.id, user_id: user.id, message: parsed.data.message, project_name: parsed.data.projectName || null, website_url: parsed.data.websiteUrl || null, github_url: parsed.data.githubUrl || null, additional_notes: parsed.data.additionalNotes || null });
  if (contentError) { await supabase.from("capsules").delete().eq("id", capsule.id); redirect(`/dashboard/new?error=${encodeURIComponent("Could not save your capsule. Try again.")}`); }
  redirect(`/dashboard/${capsule.id}`);
}

export async function openCapsule(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.rpc("open_capsule", { capsule_uuid: id });
  if (error) redirect(`/dashboard/${id}?error=${encodeURIComponent("This capsule is not ready to open yet.")}`);
  redirect(`/dashboard/${id}`);
}

export async function signOut() { const supabase = await createClient(); await supabase.auth.signOut(); redirect("/"); }
