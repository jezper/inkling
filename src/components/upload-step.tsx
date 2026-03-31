"use client";

import { useRef, useState, useCallback, useId } from "react";
import { Upload, FileText, AlertCircle, Loader2, X } from "lucide-react";

// --- Exported pure functions (testable) ---

export const MAX_FILES = 5;
const MAX_FILE_SIZE_MB = 25;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const MAX_COMBINED_CHARS = 50_000;

export function validateFile(file: File): string | null {
  if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
    return "Filen måste vara en PDF.";
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return `Filen är för stor. Max ${MAX_FILE_SIZE_MB} MB tillåts.`;
  }
  return null;
}

export function combineFileTexts(
  entries: { text: string; pageCount: number }[],
): { text: string; pageCount: number } {
  if (entries.length === 0) return { text: "", pageCount: 0 };
  return {
    text: entries.map((e) => e.text).join("\n\n---\n\n"),
    pageCount: entries.reduce((sum, e) => sum + e.pageCount, 0),
  };
}

// --- Types ---

interface FileEntry {
  id: string;
  file: File;
  status: "parsing" | "ready" | "error";
  text: string;
  pageCount: number;
  errorMessage?: string;
}

export interface UploadStepProps {
  onAnalyze: (result: { text: string; pageCount: number; fileNames: string[] }) => void;
  onError: (message: string) => void;
  isProcessing: boolean;
}

// --- Component ---

export function UploadStep({ onAnalyze, onError, isProcessing }: UploadStepProps) {
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const errorId = useId();

  const addFiles = useCallback(
    async (newFiles: File[]) => {
      setValidationError(null);

      const remaining = MAX_FILES - files.length;
      if (remaining <= 0) {
        setValidationError(`Max ${MAX_FILES} filer tillåts.`);
        return;
      }

      const toAdd = newFiles.slice(0, remaining);
      if (newFiles.length > remaining) {
        setValidationError(`Max ${MAX_FILES} filer tillåts. ${newFiles.length - remaining} fil(er) hoppades över.`);
      }

      const entries: FileEntry[] = toAdd.map((file) => {
        const error = validateFile(file);
        return {
          id: crypto.randomUUID(),
          file,
          status: error ? ("error" as const) : ("parsing" as const),
          text: "",
          pageCount: 0,
          errorMessage: error ?? undefined,
        };
      });

      setFiles((prev) => [...prev, ...entries]);

      const { parsePdf } = await import("@/lib/pdf-parser");

      for (const entry of entries) {
        if (entry.status === "error") continue;

        try {
          const result = await parsePdf(entry.file);
          setFiles((prev) =>
            prev.map((f) =>
              f.id === entry.id
                ? { ...f, status: "ready" as const, text: result.text, pageCount: result.pageCount }
                : f,
            ),
          );
        } catch (err) {
          const message = err instanceof Error ? err.message : "Kunde inte läsa filen.";
          setFiles((prev) =>
            prev.map((f) =>
              f.id === entry.id
                ? { ...f, status: "error" as const, errorMessage: message }
                : f,
            ),
          );
        }
      }
    },
    [files.length],
  );

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    setValidationError(null);
  }, []);

  const handleAnalyzeClick = useCallback(() => {
    const readyFiles = files.filter((f) => f.status === "ready");
    if (readyFiles.length === 0) return;

    const combined = combineFileTexts(readyFiles);
    if (combined.text.length > MAX_COMBINED_CHARS) {
      setValidationError("Den sammanlagda texten är för lång. Ta bort ett dokument och försök igen.");
      return;
    }

    onAnalyze({
      text: combined.text,
      pageCount: combined.pageCount,
      fileNames: readyFiles.map((f) => f.file.name),
    });
  }, [files, onAnalyze]);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const droppedFiles = Array.from(e.dataTransfer.files);
      if (droppedFiles.length > 0) void addFiles(droppedFiles);
    },
    [addFiles],
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    if (selected.length > 0) void addFiles(selected);
    e.target.value = "";
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      fileInputRef.current?.click();
    }
  };

  const hasError = !!validationError;
  const readyCount = files.filter((f) => f.status === "ready").length;
  const parsingCount = files.filter((f) => f.status === "parsing").length;
  const canAnalyze = readyCount > 0 && parsingCount === 0 && !isProcessing;
  const atLimit = files.length >= MAX_FILES;

  return (
    <div style={{ maxWidth: "680px", position: "relative" }}>
      {/* Drop zone */}
      {!atLimit && (
        <div
          role="button"
          tabIndex={0}
          aria-label={files.length === 0 ? "Välj eller dra hit dina PDF-filer" : "Lägg till fler filer"}
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
            backgroundColor: isDragging ? "var(--color-accent-glow-sm)" : "var(--color-surface-0)",
            padding: files.length > 0 ? "1.25rem 1.25rem" : "2rem 1.25rem",
            cursor: isProcessing ? "not-allowed" : "pointer",
            transition: "border-color var(--duration-normal) var(--ease-in-out), background-color var(--duration-normal) var(--ease-in-out)",
            opacity: isProcessing ? 0.6 : 1,
            display: "flex",
            flexDirection: "column" as const,
            alignItems: "center",
            gap: files.length > 0 ? "0.5rem" : "1rem",
            userSelect: "none",
          }}
        >
          <Upload
            size={files.length > 0 ? 20 : 32}
            strokeWidth={1.5}
            aria-hidden="true"
            style={{
              color: isDragging ? "var(--color-accent-500)" : "var(--color-surface-400)",
            }}
          />
          <div style={{ textAlign: "center" }}>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: files.length > 0 ? "var(--text-sm)" : "var(--text-base)",
                fontWeight: 600,
                color: "var(--color-text-primary)",
                letterSpacing: "-0.01em",
              }}
            >
              {isDragging
                ? "Släpp filerna här"
                : files.length > 0
                ? "Lägg till fler filer"
                : "Välj PDF eller dra hit den"}
            </p>
            {files.length === 0 && (
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
                PDF · Max {MAX_FILE_SIZE_MB} MB · Upp till {MAX_FILES} filer
              </p>
            )}
          </div>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf,.pdf"
        multiple
        onChange={handleInputChange}
        disabled={isProcessing}
        aria-hidden="true"
        tabIndex={-1}
        style={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden", clip: "rect(0 0 0 0)", clipPath: "inset(50%)", whiteSpace: "nowrap" }}
      />

      {/* File list */}
      {files.length > 0 && (
        <div role="list" aria-label="Uppladdade filer" aria-live="polite" style={{ marginTop: "0.75rem", display: "flex", flexDirection: "column", gap: "0.375rem" }}>
          {files.map((entry) => (
            <div
              key={entry.id}
              role="listitem"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.5rem 0.75rem",
                borderRadius: "var(--radius-md)",
                backgroundColor: entry.status === "error" ? "var(--color-severity-high-bg)" : "var(--color-surface-50)",
                border: `1px solid ${entry.status === "error" ? "var(--color-severity-high-border)" : "var(--color-surface-200)"}`,
              }}
            >
              {entry.status === "parsing" && (
                <Loader2 className="animate-spin" size={16} strokeWidth={1.5} aria-hidden="true" style={{ color: "var(--color-accent-500)", flexShrink: 0 }} />
              )}
              {entry.status === "ready" && (
                <FileText size={16} strokeWidth={1.5} aria-hidden="true" style={{ color: "var(--color-text-muted)", flexShrink: 0 }} />
              )}
              {entry.status === "error" && (
                <AlertCircle size={16} strokeWidth={1.5} aria-hidden="true" style={{ color: "var(--color-severity-high-icon)", flexShrink: 0 }} />
              )}

              <span
                style={{
                  flex: 1,
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-xs)",
                  color: entry.status === "error" ? "var(--color-severity-high-text)" : "var(--color-text-primary)",
                  letterSpacing: "0.02em",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {entry.file.name}
              </span>

              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-xs)",
                  color: entry.status === "error" ? "var(--color-severity-high-text)" : "var(--color-text-muted)",
                  letterSpacing: "0.02em",
                  flexShrink: 0,
                  whiteSpace: "nowrap",
                }}
              >
                {entry.status === "parsing" && "Läser..."}
                {entry.status === "ready" && `${entry.pageCount} ${entry.pageCount === 1 ? "sida" : "sidor"}`}
                {entry.status === "error" && (entry.errorMessage ?? "Fel")}
              </span>

              <button
                type="button"
                onClick={() => removeFile(entry.id)}
                aria-label={`Ta bort ${entry.file.name}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "28px",
                  height: "28px",
                  minWidth: "44px",
                  minHeight: "44px",
                  padding: 0,
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  color: "var(--color-text-muted)",
                  flexShrink: 0,
                }}
              >
                <X size={14} strokeWidth={2} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Analysera button */}
      {files.length > 0 && (
        <button
          type="button"
          onClick={handleAnalyzeClick}
          disabled={!canAnalyze}
          style={{
            marginTop: "1rem",
            width: "100%",
            padding: "0.75rem 1.5rem",
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-base)",
            fontWeight: 700,
            letterSpacing: "-0.01em",
            color: canAnalyze ? "var(--color-surface-0)" : "var(--color-text-muted)",
            backgroundColor: canAnalyze ? "var(--color-accent-500)" : "var(--color-surface-200)",
            border: "none",
            borderRadius: "var(--radius-md)",
            cursor: canAnalyze ? "pointer" : "not-allowed",
            transition: "background-color var(--duration-normal) var(--ease-in-out)",
            minHeight: "44px",
          }}
        >
          {parsingCount > 0
            ? "Läser filer..."
            : readyCount === 1
            ? "Analysera"
            : `Analysera ${readyCount} filer`}
        </button>
      )}

      {/* Inline error */}
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

      {/* Privacy note */}
      {!isProcessing && !hasError && files.length === 0 && (
        <p
          style={{
            marginTop: "0.75rem",
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-xs)",
            color: "var(--color-text-muted)",
            letterSpacing: "0.04em",
          }}
        >
          Ditt avtal stannar på din enhet. Namn, personnummer och andra personuppgifter rensas automatiskt innan analysen körs.{" "}
          <a href="/faq#privacy-och-säkerhet" style={{ color: "inherit", textDecoration: "underline", textUnderlineOffset: "2px" }}>Läs mer</a>
        </p>
      )}
    </div>
  );
}
