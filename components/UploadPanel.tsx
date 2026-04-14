"use client";

import React, { useCallback, useState } from "react";

interface UploadedFile {
  name: string;
  status: "uploading" | "success" | "error";
  message?: string;
}

export default function UploadPanel() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const uploadFile = useCallback(async (file: File) => {
    if (!file.name.endsWith(".pdf")) {
      setUploadedFiles((prev) => [
        { name: file.name, status: "error", message: "Only PDF files are supported" },
        ...prev,
      ]);
      return;
    }

    const entry: UploadedFile = { name: file.name, status: "uploading" };
    setUploadedFiles((prev) => [entry, ...prev]);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      setUploadedFiles((prev) =>
        prev.map((f) =>
          f.name === file.name
            ? {
                ...f,
                status: response.ok ? "success" : "error",
                message: response.ok ? data.message : (data.error || "Upload failed"),
              }
            : f
        )
      );
    } catch {
      setUploadedFiles((prev) =>
        prev.map((f) =>
          f.name === file.name
            ? { ...f, status: "error", message: "Unable to connect to server" }
            : f
        )
      );
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      Array.from(e.dataTransfer.files).forEach(uploadFile);
    },
    [uploadFile]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        Array.from(e.target.files).forEach(uploadFile);
      }
      e.target.value = "";
    },
    [uploadFile]
  );

  return (
    <div className="flex flex-col gap-3">
      {/* Drop Zone */}
      <label
        htmlFor="file-upload"
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`
          relative flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed cursor-pointer
          transition-all duration-200 min-h-[100px]
          ${isDragging
            ? "border-brand-400 bg-brand-500/10 scale-[1.02]"
            : "border-white/10 bg-white/[0.02] hover:border-brand-500/40 hover:bg-brand-500/5"
          }
        `}
      >
        <input
          id="file-upload"
          type="file"
          accept=".pdf"
          multiple
          className="hidden"
          onChange={handleFileInput}
        />
        <div className={`p-2 rounded-lg transition-colors duration-200 ${isDragging ? "bg-brand-500/20" : "bg-white/[0.05]"}`}>
          <svg className={`w-5 h-5 ${isDragging ? "text-brand-400" : "text-slate-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <div className="text-center">
          <p className="text-xs font-medium text-slate-300">
            {isDragging ? "Drop files here" : "Drag and drop or click to select"}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">Only PDF files are supported</p>
        </div>
      </label>

      {/* File List */}
      {uploadedFiles.length > 0 && (
        <div className="flex flex-col gap-1.5 max-h-[180px] overflow-y-auto pr-0.5">
          {uploadedFiles.map((file, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs border transition-all duration-200
                ${file.status === "success" ? "bg-emerald-500/10 border-emerald-500/20" : ""}
                ${file.status === "error" ? "bg-red-500/10 border-red-500/20" : ""}
                ${file.status === "uploading" ? "bg-white/[0.03] border-white/[0.06]" : ""}
              `}
            >
              {/* Icon */}
              {file.status === "uploading" && (
                <svg className="w-3.5 h-3.5 text-brand-400 animate-spin flex-shrink-0" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
              )}
              {file.status === "success" && (
                <svg className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              )}
              {file.status === "error" && (
                <svg className="w-3.5 h-3.5 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className={`font-medium truncate
                  ${file.status === "uploading" ? "text-slate-300" : ""}
                  ${file.status === "success" ? "text-emerald-300" : ""}
                  ${file.status === "error" ? "text-red-300" : ""}
                `}>
                  {file.name}
                </p>
                {file.message && (
                  <p className="text-slate-500 truncate text-[10px] mt-0.5">{file.message}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
