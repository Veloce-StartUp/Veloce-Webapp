import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { shareImage, siteConfig } from "@/lib/site";

export const alt = shareImage.alt;
export const size = { width: shareImage.width, height: shareImage.height };
export const contentType = "image/png";

const capabilities = ["Web Apps", "Mobile Apps", "Cloud & AI", "Event & Awards Platforms"];

/** The preview card shown when a page is shared on LinkedIn, Facebook, X, WhatsApp or Slack. */
export default async function OpenGraphImage() {
  const logo = await readFile(join(process.cwd(), "public/Veloce-Logo_White-Without-Name.png"));

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          padding: 72,
          color: "#ffffff",
          backgroundColor: "#000000",
          backgroundImage:
            "radial-gradient(circle at 10% 110%, rgba(34, 197, 94, 0.35), rgba(0, 0, 0, 0) 55%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`data:image/png;base64,${logo.toString("base64")}`}
            width={88}
            height={88}
            alt=""
          />
          <div style={{ fontSize: 40, fontWeight: 600 }}>{siteConfig.name}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2 }}>
            Build smarter tools for modern teams
          </div>
          <div style={{ marginTop: 24, fontSize: 32, color: "#86efac" }}>
            Software development company in Sri Lanka
          </div>
        </div>

        <div style={{ display: "flex", gap: 16 }}>
          {capabilities.map((capability) => (
            <div
              key={capability}
              style={{
                display: "flex",
                padding: "10px 24px",
                border: "1px solid rgba(74, 222, 128, 0.45)",
                borderRadius: 999,
                fontSize: 24,
                color: "#d1d5db",
              }}
            >
              {capability}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
