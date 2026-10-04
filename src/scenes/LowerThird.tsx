import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { zColor } from "@remotion/zod-types";
import { fontFamily } from "../lib/fonts";

export const lowerThirdSchema = z.object({
  name: z.string(),
  title: z.string(),
  accentColor: zColor(),
  boxColor: zColor(),
  textColor: zColor(),
  side: z.enum(["left", "right"]),
});

export type LowerThirdProps = z.infer<typeof lowerThirdSchema>;

export const LOWER_THIRD_DURATION = 150;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const outEase = Easing.bezier(0.16, 1, 0.3, 1);
const inEase = Easing.bezier(0.7, 0, 0.84, 0);

/** Accent bar wipes in, name and title slide out from behind it, then reverse. */
export const LowerThird: React.FC<LowerThirdProps> = ({
  name,
  title,
  accentColor,
  boxColor,
  textColor,
  side,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const out = durationInFrames - 22;

  const bar = interpolate(frame, [0, 12], [0, 1], { ...clamp, easing: outEase });
  const nameT = interpolate(frame, [8, 26], [0, 1], { ...clamp, easing: outEase });
  const titleT = interpolate(frame, [16, 34], [0, 1], { ...clamp, easing: outEase });
  const exitText = interpolate(frame, [out, out + 12], [0, 1], { ...clamp, easing: inEase });
  const exitBar = interpolate(frame, [out + 8, out + 20], [0, 1], { ...clamp, easing: inEase });

  const dir = side === "left" ? 1 : -1;
  const reveal = (t: number) => {
    const p = (1 - t) * 100;
    return side === "left" ? `inset(0 ${p}% 0 0)` : `inset(0 0 0 ${p}%)`;
  };

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <div
        style={{
          position: "absolute",
          bottom: 130,
          [side]: 110,
          display: "flex",
          flexDirection: side === "left" ? "row" : "row-reverse",
          alignItems: "stretch",
          gap: 18,
        }}
      >
        <div
          style={{
            width: 14,
            borderRadius: 7,
            background: accentColor,
            transform: `scaleY(${bar * (1 - exitBar)})`,
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", alignItems: side === "left" ? "flex-start" : "flex-end", gap: 10 }}>
          <div
            style={{
              background: boxColor,
              color: textColor,
              fontSize: 64,
              fontWeight: 900,
              padding: "10px 28px",
              borderRadius: 8,
              clipPath: reveal(nameT * (1 - exitText)),
              transform: `translateX(${-dir * 40 * (1 - nameT)}px)`,
            }}
          >
            {name}
          </div>
          <div
            style={{
              background: accentColor,
              color: "white",
              fontSize: 34,
              fontWeight: 500,
              padding: "8px 22px",
              borderRadius: 8,
              letterSpacing: 1,
              clipPath: reveal(titleT * (1 - exitText)),
              transform: `translateX(${-dir * 40 * (1 - titleT)}px)`,
            }}
          >
            {title}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
