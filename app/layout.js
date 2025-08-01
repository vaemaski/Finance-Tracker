import {  Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

const inter = Inter({subsets : ["latin"] });
export const metadata = {
  title: "fintrack",
  description: "Finance Tracker",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body
        className={`${inter.className}`}
      >
        {/* header */}
        <Header></Header>

        <main className="min-h-screen">{children}</main>
        <Toaster richColors/>
        {/* footer */}

        <footer className="bg-blue-50 py-12">
          <div className="container mx-auto px-4 text-center
          text-grey-300">
            <p> made with love by vaishali</p>
          </div>
        </footer>
      </body>
    </html>
    </ClerkProvider>
  
  );
}
