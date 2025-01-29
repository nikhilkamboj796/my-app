"use client";
import NavBar from "../components/NavBar";
import { SessionProvider } from "next-auth/react";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <html lang="en">
        <body>
          <NavBar />
          {children}
        </body>
      </html>
    </SessionProvider>
  );
}
