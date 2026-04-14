"use client";

import React, { useState } from "react";
import { Message } from "@/components/MessageBubble";
import ChatWindow from "@/components/ChatWindow";
import InputBar from "@/components/InputBar";
import UploadPanel from "@/components/UploadPanel";

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-glow flex-shrink-0">
        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h16a2 2 0 012 2v10a2 2 0 01-2 2h-2" />
        </svg>
      </div>
      <div>
        <h1 className="text-sm font-bold text-white leading-none">AI Assistant</h1>
        <p className="text-[10px] text-slate-500 mt-0.5">RAG Powered</p>
      </div>
    </div>
  );
}

function StatusBadge({ isConnected }: { isConnected: boolean }) {
  return (
    <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full border text-[10px] font-medium
      ${isConnected
        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
        : "bg-red-500/10 border-red-500/20 text-red-400"
      }
    `}>
      <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? "bg-emerald-400 animate-pulse" : "bg-red-400"}`} />
      {isConnected ? "Online" : "Offline"}
    </div>
  );
}

function SidebarSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest px-1">{title}</p>
      {children}
    </div>
  );
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isConnected] = useState(true);
  const [messageCount, setMessageCount] = useState(0);

  const handleSend = async (text: string) => {
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    setMessageCount((c) => c + 1);

    try {
      const formData = new FormData();
      formData.append("question", text);

      const response = await fetch("/api/ask", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        role: response.ok ? "assistant" : "error",
        content: response.ok
          ? (data.answer || "No answer available.")
          : (data.error || "An error occurred while processing your question."),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: "error",
          content: "Unable to connect to the server. Please check if the backend server is running.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    setMessageCount(0);
  };

  return (
    <div className="flex h-screen bg-[#0d0d18] overflow-hidden">
      {/* ─── Sidebar ─── */}
      <aside
        className={`
          flex flex-col border-r border-white/[0.06] bg-[#0d0d18]
          transition-all duration-300 ease-in-out flex-shrink-0
          ${sidebarOpen ? "w-72" : "w-0 overflow-hidden border-0"}
        `}
      >
        <div className="flex flex-col h-full p-4 gap-6 min-w-72">
          {/* Header */}
          <div className="flex items-center justify-between pt-1">
            <Logo />
            <StatusBadge isConnected={isConnected} />
          </div>

          {/* Divider */}
          <div className="h-px bg-white/[0.06]" />

          {/* Upload section */}
          <SidebarSection title="Upload Documents">
            <UploadPanel />
          </SidebarSection>

          {/* Divider */}
          <div className="h-px bg-white/[0.06]" />

          {/* Chat history placeholder */}
          <SidebarSection title="Current session">
            <div className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-brand-500/10 border border-brand-500/20">
              <div className="flex items-center gap-2.5">
                <svg className="w-3.5 h-3.5 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span className="text-xs font-medium text-slate-300">Current Chat</span>
              </div>
              <span className="text-[10px] tabular-nums bg-brand-500/20 text-brand-300 px-1.5 py-0.5 rounded-md font-medium">
                {messageCount}
              </span>
            </div>
          </SidebarSection>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Clear button */}
          {messages.length > 0 && (
            <button
              id="clear-chat-btn"
              onClick={handleClearChat}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all duration-200"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Xóa lịch sử chat
            </button>
          )}

          {/* Footer */}
          <div className="flex items-center gap-2 px-1">
            <div className="w-1 h-1 rounded-full bg-brand-500" />
            <p className="text-[10px] text-slate-600">AI Assistant v1.0 · TinyLlama</p>
          </div>
        </div>
      </aside>

      {/* ─── Main Content ─── */}
      <main className="flex flex-col flex-1 min-w-0">
        {/* Top Bar */}
        <header className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06] bg-[#0d0d18]/80 backdrop-blur-sm flex-shrink-0">
          {/* Toggle sidebar button */}
          <button
            id="toggle-sidebar-btn"
            onClick={() => setSidebarOpen((v) => !v)}
            title={sidebarOpen ? "Ẩn sidebar" : "Hiện sidebar"}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {!sidebarOpen && <Logo />}

          <div className="flex-1" />

          {/* Stats */}
          {messages.length > 0 && (
            <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              {messages.length} tin nhắn
            </div>
          )}

          {/* Model badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-white/[0.08] bg-white/[0.03]">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
            <span className="text-[10px] text-slate-400 font-medium">TinyLlama 1.1B</span>
          </div>
        </header>

        {/* Chat Area */}
        <div className="flex flex-col flex-1 min-h-0">
          <ChatWindow messages={messages} isLoading={isLoading} />
          <InputBar onSend={handleSend} disabled={isLoading} />
        </div>
      </main>
    </div>
  );
}
