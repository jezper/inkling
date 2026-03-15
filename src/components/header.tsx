import { Logo } from "./logo";

export function Header() {
  return (
    <header
      className="absolute top-0 left-0 z-20 w-full"
      style={{ borderBottom: "1px solid var(--border)" }}
    >
      <div
        className="flex items-center justify-center"
        style={{ padding: "1rem 1.5rem" }}
      >
        <a
          href="/"
          aria-label="inkling — startsida"
          className="inline-flex items-center"
          style={{ minHeight: "44px" }}
        >
          <Logo />
        </a>
      </div>
    </header>
  );
}
