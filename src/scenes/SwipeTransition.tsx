import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { zColor } from "@remotion/zod-types";

export const swipeTransitionSchema = z.object({
  colors: z.array(zColor()).min(1),
  direction: z.enum(["left-to-right", "right-to-left"]),
  angle: z.number().min(-45).max(45).step(1),
});

export type SwipeTransitionProps = z.infer<typeof swipeTransitionSchema>;

export const SWIPE_TRANSITION_DURATION = 30;

/**
 * Stacked colour bands sweep across and fully cover the frame at the midpoint,
 * then sweep off. Put the cut between your two clips on the middle frame.
 */
export const SwipeTransition: React.FC<SwipeTransitionProps> = ({ colors, direction, angle }) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const mid = durationInFrames / 2;
  const stagger = Math.max(1, Math.round(durationInFrames / 15));

  // Each band must be big enough to cover the frame when rotated.
  const diag = Math.hypot(width, height);
  const bandW = diag * 1.2;
  const sign = direction === "left-to-right" ? 1 : -1;
  const last = colors.length - 1;

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {colors.map((color, i) => {
        const inStart = i * stagger;
        const inEnd = mid; // every band lands by the midpoint
        // Top band leaves first so the lower ones trail behind it.
        const outStart = mid + (last - i) * stagger * 0.5;
        const outEnd = durationInFrames - i * stagger;
        const enter = interpolate(frame, [inStart, Math.max(inStart + 1, inEnd)], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.6, 0, 0.3, 1),
        });
        const leave = interpolate(frame, [outStart, Math.max(outStart + 1, outEnd)], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.6, 0, 0.3, 1),
        });
        // -1 = fully off one side, 0 = covering, +1 = fully off the other side.
        const pos = enter - 1 + leave;
        const x = width / 2 - bandW / 2 + sign * pos * (width / 2 + bandW / 2 + diag * 0.3);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: height / 2 - diag,
              left: x,
              width: bandW,
              height: diag * 2,
              background: color,
              transform: `rotate(${angle}deg)`,
              zIndex: i,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
