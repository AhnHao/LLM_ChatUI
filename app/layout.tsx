import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Assistant — RAG Chatbot",
  description:
    "Intelligent document-powered AI Assistant. Upload PDFs and ask questions using Retrieval-Augmented Generation.",
  keywords: ["AI", "chatbot", "RAG", "document Q&A", "LLM"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full">
      <body className="h-full bg-[#0d0d18] text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}
