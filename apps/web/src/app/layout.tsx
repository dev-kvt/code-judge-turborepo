import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import RecoilRootLayout from "../providers/recoil-root-provider";
import { RoleProvider } from "../providers/role-provider";
import Navbar from "@/components/navbar/navbar";
import FooterProvider from "@/components/footer/footer-provider";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI-Powered Code Grading & Doubt Resolution Portal",
  description: "Full-stack AI-enabled LMS module with sandboxed code execution, dual-LLM grading, and doubt review workflows",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <RecoilRootLayout>
            <RoleProvider>
              <Toaster position="bottom-center" />
              <Navbar />
              <div className="flex-grow flex flex-col">{children}</div>
              <FooterProvider />
            </RoleProvider>
          </RecoilRootLayout>
        </div>
      </body>
    </html>
  );
}
