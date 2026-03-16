import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt =
  "Kolla Avtalet | Förstå ditt anställningsavtal innan du skriver under";
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
          background: "#0A0A0C",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          padding: "80px 90px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: "28px",
            letterSpacing: "-0.02em",
          }}
        >
          <span style={{ fontWeight: 400, color: "#88889A" }}>kolla</span>
          <span style={{ fontWeight: 700, color: "#DC1E38" }}>/</span>
          <span style={{ fontWeight: 700, color: "#F5F5F7" }}>avtalet</span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <div
            style={{
              fontSize: "68px",
              fontWeight: 700,
              color: "#F5F5F7",
              lineHeight: 1.0,
              letterSpacing: "-0.04em",
              maxWidth: "900px",
            }}
          >
            Grattis till jobbet.
            <br />
            <span style={{ color: "#DC1E38" }}>Vet du vad du tackar ja till?</span>
          </div>
          <div
            style={{
              fontSize: "26px",
              color: "#88889A",
              lineHeight: 1.4,
              maxWidth: "720px",
              fontWeight: 400,
            }}
          >
            Varje klausul jämförs mot lag, marknadspraxis och lönedata.
            Snabbkoll gratis. Full rapport 99 kr.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: "16px",
            color: "#5C5C6A",
          }}
        >
          <span>kollaavtalet.com</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
