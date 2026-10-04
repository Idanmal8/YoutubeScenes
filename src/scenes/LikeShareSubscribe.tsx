import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import { zColor } from "@remotion/zod-types";
import { fontFamily } from "../lib/fonts";
import { BellIcon, ShareIcon, ThumbUpIcon } from "../components/Icons";

export const likeShareSubscribeSchema = z.object({
  likeLabel: z.string(),
  shareLabel: z.string(),
  subscribeLabel: z.string(),
  likeColor: zColor(),
  shareColor: zColor(),
  subscribeColor: zColor(),
  position: z.enum(["bottom", "center", "top"]),
  scale: z.number().min(0.4).max(2).step(0.05),
});

export type LikeShareSubscribeProps = z.infer<typeof likeShareSubscribeSchema>;

export const LIKE_SHARE_SUBSCRIBE_DURATION = 150;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const STAGGER = 7;
const ACTIVATE_AT = [34, 54, 74];
const EXIT = 124;

const Burst: React.FC<{ t: number; color: string; seed: string }> = ({ t, color, seed }) => {
  if (t <= 0 || t >= 1) return null;
  return (
    <>
      {Array.from({ length: 10 }, (_, i) => {
        const angle = (i / 10) * Math.PI * 2 + random(`${seed}${i}`) * 0.4;
        const dist = 70 + 70 * Easing.out(Easing.cubic)(t) + random(`${seed}d${i}`) * 20;
        const size = 12 * (1 - t) + 2;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: size,
              height: size,
              marginLeft: -size / 2,
              marginTop: -size / 2,
              borderRadius: "50%",
              background: i % 2 ? color : "white",
              transform: `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px)`,
              opacity: 1 - t,
            }}
          />
        );
      })}
    </>
  );
};

const ActionPill: React.FC<{
  index: number;
  label: string;
  color: string;
  icon: (color: string, active: number) => React.ReactNode;
}> = ({ index, label, color, icon }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame: frame - index * STAGGER, fps, config: { damping: 12 } });
  const exit = spring({ frame: frame - EXIT - index * 4, fps, config: { damping: 15 } });
  const shown = enter - exit;

  const at = ACTIVATE_AT[index];
  const active = spring({ frame: frame - at, fps, config: { damping: 10, stiffness: 180 } });
  const press = interpolate(frame, [at - 5, at, at + 4], [0, 1, 0], clamp);
  const burstT = interpolate(frame, [at, at + 20], [0, 1], clamp);
  const isActive = frame >= at;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 18,
        opacity: Math.min(1, shown * 1.4),
        transform: `translateY(${(1 - shown) * 80}px) scale(${0.6 + 0.4 * shown})`,
      }}
    >
      <div
        style={{
          position: "relative",
          width: 150,
          height: 150,
          borderRadius: "50%",
          background: isActive ? color : "rgba(20,20,20,0.9)",
          border: `4px solid ${isActive ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.18)"}`,
          boxShadow: `0 16px 40px rgba(0,0,0,0.45), 0 0 ${active * 40}px ${color}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${(1 - press * 0.12) * (1 + 0.12 * Math.sin(Math.min(1, active) * Math.PI))})`,
        }}
      >
        <Burst t={burstT} color={color} seed={`b${index}`} />
        {icon("white", active)}
      </div>
      <div
        style={{
          fontFamily,
          fontWeight: 900,
          fontSize: 38,
          letterSpacing: 2,
          color: "white",
          textTransform: "uppercase",
          textShadow: "0 4px 16px rgba(0,0,0,0.6)",
        }}
      >
        {label}
      </div>
    </div>
  );
};

export const LikeShareSubscribe: React.FC<LikeShareSubscribeProps> = (props) => {
  const frame = useCurrentFrame();
  const ringT = Math.max(0, frame - ACTIVATE_AT[2]);
  const bellAngle = frame >= ACTIVATE_AT[2] ? Math.sin(ringT * 1.1) * 26 * Math.exp(-ringT / 14) : 0;
  const shareHop = interpolate(frame, [ACTIVATE_AT[1], ACTIVATE_AT[1] + 6, ACTIVATE_AT[1] + 16], [0, 1, 0], clamp);

  return (
    <AbsoluteFill
      style={{
        justifyContent:
          props.position === "bottom" ? "flex-end" : props.position === "top" ? "flex-start" : "center",
        alignItems: "center",
        padding: 90,
      }}
    >
      <div style={{ display: "flex", gap: 90, transform: `scale(${props.scale})` }}>
        <ActionPill
          index={0}
          label={props.likeLabel}
          color={props.likeColor}
          icon={(c, a) => (
            <ThumbUpIcon size={72} color={c} style={{ transform: `rotate(${-20 * Math.sin(Math.min(1, a) * Math.PI)}deg)` }} />
          )}
        />
        <ActionPill
          index={1}
          label={props.shareLabel}
          color={props.shareColor}
          icon={(c) => <ShareIcon size={76} color={c} style={{ translate: `${shareHop * 14}px ${-shareHop * 10}px` }} />}
        />
        <ActionPill
          index={2}
          label={props.subscribeLabel}
          color={props.subscribeColor}
          icon={(c) => (
            <BellIcon size={74} color={c} style={{ transform: `rotate(${bellAngle}deg)`, transformOrigin: "50% 15%" }} />
          )}
        />
      </div>
    </AbsoluteFill>
  );
};
