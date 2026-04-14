"use client";

import React, { KeyboardEvent, useRef, useState } from "react";

interface InputBarProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export default function InputBar({ onSend, disabled }: InputBarProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  };

  const canSend = value.trim().length > 0 && !disabled;

  return (
    <div className="p-4 border-t border-white/[0.06]">
      <div
        className={`
          flex items-end gap-3 rounded-2xl border px-4 py-3
          bg-white/[0.04] transition-all duration-200
          ${disabled ? "border-white/[0.04] opacity-60" : "border-white/[0.08] focus-within:border-brand-500/50 focus-within:shadow-glow focus-within:bg-white/[0.06]"}
        `}
      >
        <textarea
          ref={textareaRef}
          id="chat-input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          disabled={disabled}
          placeholder={disabled ? "AI is responding..." : "Ask a question... (Enter to send, Shift+Enter for new line)"}
          rows={1}
          className="flex-1 bg-transparent text-sm text-slate-100 placeholder-slate-500 resize-none outline-none leading-relaxed max-h-40 py-0.5 disabled:cursor-not-allowed"
        />

        <button
          id="send-button"
          onClick={handleSend}
          disabled={!canSend}
          title="Send message"
          className={`
            flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center
            transition-all duration-200 mb-0.5
            ${canSend
              ? "bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-glow hover:shadow-glow-lg hover:scale-105 active:scale-95"
              : "bg-white/[0.05] text-slate-600 cursor-not-allowed"
            }
          `}
        >
          {disabled ? (
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          )}
        </button>
      </div>

      <p className="text-center text-[10px] text-slate-600 mt-2">
        AI may make mistakes. Please verify important information.
      </p>
    </div>
  );
}
