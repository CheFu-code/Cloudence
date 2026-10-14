import { ImageResponse } from "next/og";

export const alt =
  "Cloudence — cloud storage and file sharing by Chefu Technologies";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "90px",
          background: "#f8fafc",
          color: "#0f172a",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div
            style={{
              display: "flex",
              width: 100,
              height: 100,
              alignItems: "center",
              justifyContent: "center",
              background: "#0d9488",
              borderRadius: 24,
            }}
          >
            <svg width="74" height="74" viewBox="0 0 32 32" fill="none">
              <path
                d="M21.5 14.5C21.5 11.4624 19.0376 9 16 9C13.4357 9 11.2727 10.7582 10.6552 13.1257C8.5833 13.3857 7 15.1384 7 17.25C7 19.5972 8.90279 21.5 11.25 21.5H21C23.2091 21.5 25 19.7091 25 17.5C25 15.8924 23.9538 14.5292 22.4828 14.0729"
                stroke="white"
                strokeWidth="2.25"
                strokeLinecap="round"
              />
              <path
                d="M16 11.75V18.75L13.5 16.25M16 18.75L18.5 16.25"
                stroke="white"
                strokeWidth="2.25"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <span style={{ fontSize: 80, fontWeight: 700 }}>Cloudence</span>
        </div>
        <div style={{ display: "flex", marginTop: 48, fontSize: 42 }}>
          A focused workspace for your files.
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 24,
            fontSize: 26,
            color: "#475569",
          }}
        >
          Store, organize, and share. By Chefu Technologies.
        </div>
      </div>
    ),
    size,
  );
}
