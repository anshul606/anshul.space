import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

// Image generation
export default async function Icon() {
  const fontData = await fetch(
    "https://cdn.jsdelivr.net/npm/@fontsource/inter/files/inter-latin-900-normal.woff"
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 24, // Slightly larger font size for thick Inter 900
          background: "transparent",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontWeight: 900,
          fontFamily: "Inter",
          lineHeight: 1,
        }}
      >
        <span style={{ display: "flex", alignItems: "center" }}>A</span>
        <span style={{ color: "#ff3344", marginLeft: "0.5px" }}>.</span>
      </div>
    ),
    // ImageResponse options
    {
      ...size,
      fonts: [
        {
          name: "Inter",
          data: fontData,
          style: "normal",
          weight: 900,
        },
      ],
    }
  );
}
