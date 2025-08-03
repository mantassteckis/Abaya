import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs';

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { StoreProvider } from "@/contexts/store-context";

import "./globals.css";
import ModalProvider from "@/providers/modal-provider";
import ToastProvider from "@/providers/toast-provider";

const font = Urbanist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nour Abaya",
  description: "Premium Abaya Collection - Elegant and Modern Islamic Fashion",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={font.className}>
          <StoreProvider>
            <ModalProvider />
            <ToastProvider />
            <Navbar />
            {children}
            <Footer />
          </StoreProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
