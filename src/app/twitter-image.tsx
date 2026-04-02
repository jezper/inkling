import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt =
  "Kolla Avtalet | Förstå ditt anställningsavtal innan du skriver under";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

async function loadFont() {
  const res = await fetch(
    new URL("../../public/fonts/SpaceGrotesk-Regular.ttf", import.meta.url),
  );
  return res.arrayBuffer();
}

export default async function Image() {
  const fontData = await loadFont();

  return new ImageResponse(
    (
      <div
        style={{
          background: "#F5F5F7",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px 90px",
          gap: "32px",
          fontFamily: "Space Grotesk",
        }}
      >
        <div style={{ display: "flex", fontSize: "36px" }}>
          <span style={{ color: "#88889A" }}>kolla</span>
          <span style={{ color: "#DC1E38" }}>/</span>
          <span style={{ color: "#0A0A0C" }}>avtalet</span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: "80px",
            color: "#0A0A0C",
            lineHeight: 1.05,
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
            fontSize: "30px",
            color: "#47474F",
            lineHeight: 1.4,
          }}
        >
          Varje klausul mot lag, marknadspraxis och lönedata.
          Snabbkoll gratis.
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Space Grotesk",
          data: fontData,
          style: "normal",
        },
      ],
    },
  );
}
