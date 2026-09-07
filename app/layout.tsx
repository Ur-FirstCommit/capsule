import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "Capsule | Leave something for later", description: "A private time capsule for your future self." };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
