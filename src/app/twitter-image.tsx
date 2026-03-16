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
          justifyContent: "center",
          padding: "80px 90px",
          gap: "40px",
        }}
      >
        <div style={{ display: "flex", fontSize: "28px" }}>
          <span style={{ color: "#88889A" }}>kolla</span>
          <span style={{ color: "#DC1E38" }}>/</span>
          <span style={{ color: "#F5F5F7" }}>avtalet</span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: "64px",
              color: "#F5F5F7",
              lineHeight: 1.1,
            }}
          >
            <span>Grattis till jobbet.</span>
            <span style={{ color: "#DC1E38" }}>
              Vet du vad du tackar ja till?
            </span>
          </div>

          <div
            style={{
              display: "flex",
              fontSize: "24px",
              color: "#88889A",
              lineHeight: 1.4,
            }}
          >
            Varje klausul mot lag, marknadspraxis och lönedata. Snabbkoll
            gratis.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: "16px",
            color: "#5C5C6A",
          }}
        >
          kollaavtalet.com
        </div>
      </div>
    ),
    { ...size },
  );
}
