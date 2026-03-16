"use client";

import { useRef, useState, useCallback, useId } from "react";
// useId används för felmeddelandes id — kopplar aria-describedby till feltext
import { Upload, FileText, AlertCircle, Loader2 } from "lucide-react";

export interface UploadStepProps {
  onParsed: (result: { text: string; pageCount: number; fileName: string }) => void;
  onError: (message: string) => void;
  isProcessing: boolean;
}

const MAX_FILE_SIZE_MB = 25;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

function validateFile(file: File): string | null {
  if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
    return "Filen måste vara en PDF.";
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return `Filen är för stor. Max ${MAX_FILE_SIZE_MB} MB tillåts.`;
  }
  return null;
}

export function UploadStep({ onParsed, onError, isProcessing }: UploadStepProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [progressMessage, setProgressMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const errorId = useId();

  const handleFile = useCallback(
    async (file: File) => {
      setValidationError(null);
      const error = validateFile(file);
      if (error) {
        setValidationError(error);
        return;
      }
      setSelectedFile(file);

      // Dynamisk import för att undvika SSR-problem med pdf.js
      try {
        const { parsePdf } = await import("@/lib/pdf-parser");
        const result = await parsePdf(file, (msg) => setProgressMessage(msg));
        setProgressMessage(null);
        onParsed({ ...result, fileName: file.name });
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Vi kunde inte läsa dokumentet. Prova en annan PDF.";
        onError(message);
        setSelectedFile(null);
      }
    },
    [onParsed, onError]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) void handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    // Undvik false trigger vid hover av barn-element
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) void handleFile(file);
    // Återställ input så samma fil kan väljas igen
    e.target.value = "";
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      fileInputRef.current?.click();
    }
  };

  const hasError = !!validationError;

  return (
    <div style={{ maxWidth: "680px", position: "relative" }}>
      {/* Drop-zon */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Välj eller dra hit din PDF — anställningsavtal"
        aria-describedby={hasError ? errorId : undefined}
        aria-disabled={isProcessing}
        onDrop={isProcessing ? undefined : handleDrop}
        onDragOver={isProcessing ? undefined : handleDragOver}
        onDragLeave={isProcessing ? undefined : handleDragLeave}
        onClick={() => !isProcessing && fileInputRef.current?.click()}
        onKeyDown={isProcessing ? undefined : handleKeyDown}
        style={{
          border: `2px dashed ${
            hasError
              ? "var(--color-severity-high-icon)"
              : isDragging
              ? "var(--color-accent-500)"
              : "var(--color-surface-300)"
          }`,
          borderRadius: "var(--radius-md)",
          backgroundColor: isDragging
            ? "var(--color-accent-glow-sm)"
            : "var(--color-surface-0)",
          padding: "2rem 1.25rem",
          cursor: isProcessing ? "not-allowed" : "pointer",
          transition: "border-color var(--duration-normal) var(--ease-in-out), background-color var(--duration-normal) var(--ease-in-out)",
          opacity: isProcessing ? 0.6 : 1,
          display: "flex",
          flexDirection: "column" as const,
          alignItems: "center",
          gap: "1rem",
          userSelect: "none",
        }}
      >
        {isProcessing ? (
          <>
            <Loader2
              className="animate-spin"
              size={32}
              strokeWidth={1.5}
              aria-hidden="true"
              style={{ color: "var(--color-accent-500)" }}
            />
            <div style={{ textAlign: "center" }}>
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--text-base)",
                  fontWeight: 600,
                  color: "var(--color-text-primary)",
                  letterSpacing: "-0.01em",
                }}
              >
                Läser dokumentet
              </p>
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-xs)",
                  color: "var(--color-text-muted)",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase" as const,
                  marginTop: "0.25rem",
                }}
              >
                Text extraheras, ett ögonblick
              </p>
            </div>
          </>
        ) : selectedFile ? (
          <>
            <FileText
              size={32}
              strokeWidth={1.5}
              aria-hidden="true"
              style={{ color: "var(--color-accent-500)" }}
            />
            <div style={{ textAlign: "center" }}>
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--text-base)",
                  fontWeight: 600,
                  color: "var(--color-text-primary)",
                  letterSpacing: "-0.01em",
                  wordBreak: "break-word",
                }}
              >
                {selectedFile.name}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-xs)",
                  color: "var(--color-text-muted)",
                  letterSpacing: "0.06em",
                  marginTop: "0.25rem",
                }}
              >
                {progressMessage ?? `${(selectedFile.size / 1024 / 1024).toFixed(1)} MB`}
              </p>
            </div>
          </>
        ) : (
          <>
            <Upload
              size={32}
              strokeWidth={1.5}
              aria-hidden="true"
              style={{
                color: isDragging
                  ? "var(--color-accent-500)"
                  : "var(--color-surface-400)",
              }}
            />
            <div style={{ textAlign: "center" }}>
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--text-base)",
                  fontWeight: 600,
                  color: "var(--color-text-primary)",
                  letterSpacing: "-0.01em",
                }}
              >
                {isDragging ? "Släpp filen här" : "Välj PDF eller dra hit den"}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-xs)",
                  color: "var(--color-text-muted)",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase" as const,
                  marginTop: "0.25rem",
                }}
              >
                PDF · Max {MAX_FILE_SIZE_MB} MB
              </p>
            </div>
          </>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf,.pdf"
          onChange={handleInputChange}
          disabled={isProcessing}
          aria-hidden="true"
          tabIndex={-1}
          style={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden", clip: "rect(0 0 0 0)", clipPath: "inset(50%)", whiteSpace: "nowrap" }}
        />
      </div>

      {/* Inline-felmeddelande — aldrig toast */}
      {hasError && (
        <p
          id={errorId}
          role="alert"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            marginTop: "0.75rem",
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-xs)",
            color: "var(--color-severity-high-icon)",
            letterSpacing: "0.02em",
          }}
        >
          <AlertCircle size={14} strokeWidth={2} aria-hidden="true" />
          {validationError}
        </p>
      )}

      {/* Privacy-not */}
      {!isProcessing && !hasError && (
        <p
          style={{
            marginTop: "0.75rem",
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-xs)",
            color: "var(--color-text-muted)",
            letterSpacing: "0.04em",
          }}
        >
          Dokumentet bearbetas i webbläsaren. Det lämnar aldrig din enhet.
        </p>
      )}
    </div>
  );
}
