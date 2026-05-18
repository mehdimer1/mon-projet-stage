import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Seller Dashboard",
  description: "Seller page",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
     <body className="bg-white text-zinc-900">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}