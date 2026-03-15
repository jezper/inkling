export function Logo({
  className = "",
  size = "default",
}: {
  className?: string;
  size?: "default" | "large";
}) {
  const fontSize = size === "large" ? "clamp(1.25rem, 3vw, 1.75rem)" : "0.9375rem";
  const tracking = size === "large" ? "0.14em" : "0.12em";

  return (
    <span
      className={`select-none font-display ${className}`}
      aria-label="inkling"
      style={{
        fontFamily: "var(--font-display)",
        fontSize,
        fontWeight: 700,
        letterSpacing: tracking,
        lineHeight: 1,
        textTransform: "uppercase" as const,
        color: "var(--color-text-primary)",
      }}
    >
      <span style={{ color: "var(--color-accent-text)" }}>ink</span>ling
    </span>
  );
}
