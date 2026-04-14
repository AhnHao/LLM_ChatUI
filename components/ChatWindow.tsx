"use client";

import React, { useEffect, useRef } from "react";
import MessageBubble, { Message, TypingIndicator } from "./MessageBubble";

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 px-6 animate-fade-in">
      {/* Logo */}
      <div className="relative">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-glow-lg">
          <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h16a2 2 0 012 2v10a2 2 0 01-2 2h-2" />
          </svg>
        </div>
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-[#0d0d18] animate-pulse" />
      </div>

      <div className="text-center max-w-sm">
        <h2 className="text-xl font-semibold text-white mb-2">Hello! I'm an AI Assistant</h2>
        <p className="text-sm text-slate-400 leading-relaxed">
          Upload PDF documents in the sidebar, then ask me questions. I'll search and answer based on the document content.
        </p>
      </div>

      {/* Suggestion chips */}
      <div className="flex flex-col gap-2 w-full max-w-sm">
        <p className="text-xs text-slate-500 text-center uppercase tracking-wider mb-1">Suggested Questions</p>
        {[
          "What does this document discuss?",
          "Summarize the main content",
          "Explain key concepts",
        ].map((suggestion) => (
          <div
            key={suggestion}
            className="px-4 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.03] text-sm text-slate-400 text-center cursor-default hover:bg-white/[0.06] hover:border-brand-500/30 transition-all duration-200"
          >
            {suggestion}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ChatWindow({ messages, isLoading }: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto">
      {messages.length === 0 && !isLoading ? (
        <EmptyState />
      ) : (
        <div className="flex flex-col gap-6 p-6 pb-2">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          {isLoading && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>
      )}
    </div>
  );
}
