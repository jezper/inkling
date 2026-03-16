import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt =
  "Kolla Avtalet - Granska ditt anställningsavtal mot svensk arbetsrätt";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0D0D0F",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          padding: "80px 90px",
          fontFamily: "serif",
        }}
      >
        {/* Top: eyebrow */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontFamily: "monospace",
            fontSize: "18px",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#C8922A",
            fontWeight: 500,
          }}
        >
          kollaavtalet.com
        </div>

        {/* Middle: main headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          <div
            style={{
              fontSize: "72px",
              fontWeight: 700,
              color: "#F2EDE8",
              lineHeight: 1.0,
              letterSpacing: "-0.04em",
              maxWidth: "900px",
            }}
          >
            Granska ditt
            <br />
            <span style={{ color: "#E63E1E" }}>anställningsavtal.</span>
          </div>
          <div
            style={{
              fontSize: "28px",
              color: "#9E9EA8",
              lineHeight: 1.4,
              maxWidth: "720px",
              fontWeight: 400,
              letterSpacing: "-0.01em",
            }}
          >
            Vi jämför varje punkt mot lag, marknadspraxis och lönedata.
            Snabbkoll gratis. Full rapport 99 kr.
          </div>
        </div>

        {/* Bottom: trust signals */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "32px",
            fontFamily: "monospace",
            fontSize: "16px",
            color: "#5C5C6A",
            letterSpacing: "0.04em",
          }}
        >
          <span>Dokumentet lämnar aldrig din enhet</span>
          <span style={{ color: "#2B2B30" }}>|</span>
          <span>Ingen registrering</span>
          <span style={{ color: "#2B2B30" }}>|</span>
          <span>LAS + 5 arbetsrättslagar</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
