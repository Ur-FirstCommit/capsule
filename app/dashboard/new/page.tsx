import Link from "next/link";
import { CapsuleForm } from "@/components/CapsuleForm";
export default async function NewCapsule({ searchParams }: { searchParams: Promise<{ error?: string }> }) { const params = await searchParams; return <section className="content"><div className="create-card glass"><Link className="subtle" href="/dashboard">← Back to capsules</Link><p className="eyebrow">A note to later</p><h1>Make it meaningful.</h1><p className="subtle">It will stay private until the day you choose.</p><CapsuleForm error={params.error} /></div></section> }
