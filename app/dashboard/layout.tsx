import { Nav } from "@/components/Nav";
export default function DashboardLayout({ children }: { children: React.ReactNode }) { return <main className="app-shell"><Nav />{children}</main>; }
