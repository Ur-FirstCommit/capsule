import Link from "next/link";

export default function Home() {
  return <main className="landing shell"><div className="orb orb-a" /><div className="orb orb-b" /><nav className="nav glass"><Link className="brand" href="/"><span className="brand-mark">✦</span> capsule</Link><div className="nav-actions"><Link href="/login">Sign in</Link><Link className="button button-small" href="/signup">Create yours</Link></div></nav><section className="hero"><p className="eyebrow">A quiet place for future you</p><h1>Leave a little<br /><em>light ahead.</em></h1><p className="hero-copy">Write down what matters now. Capsule keeps it safe until the day you choose to see it again.</p><Link className="button" href="/signup">Seal a capsule <span>↗</span></Link><div className="hero-card glass"><div><span className="tiny-label">NEXT OPENING</span><strong>September 7, 2027</strong></div><span className="lock">⌁</span><p>“The things we save become the places we return to.”</p></div></section></main>;
}
