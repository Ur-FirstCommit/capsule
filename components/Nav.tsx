import Link from "next/link";
import { signOut } from "@/app/dashboard/actions";
export function Nav() { return <nav className="nav glass"><Link className="brand" href="/dashboard"><span className="brand-mark">✦</span> capsule</Link><div className="nav-actions"><Link href="/dashboard/new">New capsule</Link><form action={signOut}><button className="button button-small" type="submit">Sign out</button></form></div></nav>; }
