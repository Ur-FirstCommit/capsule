import Link from "next/link";
import { signOut } from "@/app/dashboard/actions";
import { createClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/env";
export async function Nav() { const supabase = await createClient(); const { data: { user } } = await supabase.auth.getUser(); const admin = isAdminEmail(user?.email); return <nav className="nav glass"><Link className="brand" href="/dashboard"><span className="brand-mark">✦</span> capsule</Link><div className="nav-actions">{admin && <Link href="/admin/users">Users</Link>}<Link href="/dashboard/new">New capsule</Link><form action={signOut}><button className="button button-small" type="submit">Sign out</button></form></div></nav>; }
