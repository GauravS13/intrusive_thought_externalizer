import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Intrusive Thought Externalizer — Meet Your Thought Visitors",
  description:
    "Transform intrusive thoughts into harmless, illustrated cartoon characters using ACT cognitive defusion. Your thoughts stay on your device — nothing is stored on any server.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
