import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Face Recognition Attendance System",
  description: "Modern attendance tracking with facial recognition technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
