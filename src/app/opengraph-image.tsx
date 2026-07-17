import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/lib/site";

export const alt = `${SITE_NAME} — PC Game Mods & Lua Scripts`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #2e1065 0%, #4c1d95 50%, #1e1b4b 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              width: 96,
              height: 96,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#7c3aed",
              borderRadius: 20,
              fontSize: 64,
              fontWeight: 800,
            }}
          >
            W
          </div>
          <div style={{ fontSize: 56, fontWeight: 800 }}>{SITE_NAME}</div>
        </div>
        <div style={{ fontSize: 40, fontWeight: 600, color: "#c4b5fd" }}>
          PC Game Mods · Lua Scripts · Modding Tools
        </div>
        <div style={{ fontSize: 28, color: "#a5b4fc", marginTop: 24 }}>
          Free downloads. blairsworkshop.com
        </div>
      </div>
    ),
    size,
  );
}
