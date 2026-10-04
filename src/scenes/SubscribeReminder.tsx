import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import { zColor } from "@remotion/zod-types";
import { resolveSrc } from "../lib/assets";
import { fontFamily } from "../lib/fonts";
import { BellIcon } from "../components/Icons";
import { ClickRipple, Cursor } from "../components/Cursor";

export const subscribeReminderSchema = z.object({
  channelName: z.string(),
  subscriberText: z.string(),
  avatarImage: z.string().describe("URL or path inside public/; empty = initial letter"),
  position: z.enum(["bottom-left", "bottom-center", "bottom-right", "center"]),
  accentColor: zColor(),
  scale: z.number().min(0.4).max(2).step(0.05),
});

export type SubscribeReminderProps = z.infer<typeof subscribeReminderSchema>;

export const SUBSCRIBE_REMINDER_DURATION = 150;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const moveEase = Easing.bezier(0.65, 0, 0.25, 1);

// Timeline
const CURSOR_IN = 22;
const CLICK_SUB = 50;
const BELL_IN = 58;
const CLICK_BELL = 82;
const EXIT = 128;

// Card geometry (local coordinates inside the card)
const CARD_W = 860;
const CARD_H = 150;
const BTN_X = 520;
const BTN_W = 220;
const BTN_H = 72;
const BELL_X = BTN_X + BTN_W + 28;

const pressCurve = (frame: number, at: number) =>
  interpolate(frame, [at - 4, at, at + 6], [0, 1, 0], clamp);

export const SubscribeReminder: React.FC<SubscribeReminderProps> = ({
  channelName,
  subscriberText,
  avatarImage,
  position,
  accentColor,
  scale,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 13, mass: 0.8 } });
  const exit = spring({ frame: frame - EXIT, fps, config: { damping: 16 } });
  const shown = enter - exit;

  const subscribed = frame >= CLICK_SUB;
  const subPress = pressCurve(frame, CLICK_SUB);
  const bellPress = pressCurve(frame, CLICK_BELL);

  const bellAppear = spring({ frame: frame - BELL_IN, fps, config: { damping: 11 } });
  // Damped wobble after the bell is clicked.
  const ringT = Math.max(0, frame - CLICK_BELL);
  const bellAngle = frame >= CLICK_BELL ? Math.sin(ringT * 1.1) * 28 * Math.exp(-ringT / 14) : 0;
  const bellActive = frame >= CLICK_BELL;

  // Cursor path in card-local coordinates.
  const btnTarget = { x: BTN_X + BTN_W * 0.55, y: CARD_H / 2 + 6 };
  const bellTarget = { x: BELL_X + 36, y: CARD_H / 2 + 6 };
  const start = { x: CARD_W + 260, y: CARD_H + 220 };
  const toBtn = interpolate(frame, [CURSOR_IN, CLICK_SUB - 6], [0, 1], { ...clamp, easing: moveEase });
  const toBell = interpolate(frame, [CLICK_SUB + 12, CLICK_BELL - 6], [0, 1], { ...clamp, easing: moveEase });
  const away = interpolate(frame, [CLICK_BELL + 14, EXIT], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  let cx = interpolate(toBtn, [0, 1], [start.x, btnTarget.x]);
  let cy = interpolate(toBtn, [0, 1], [start.y, btnTarget.y]);
  cx = interpolate(toBell, [0, 1], [cx, bellTarget.x]);
  cy = interpolate(toBell, [0, 1], [cy, bellTarget.y]);
  cx = interpolate(away, [0, 1], [cx, start.x]);
  cy = interpolate(away, [0, 1], [cy, start.y]);
  const cursorOpacity = interpolate(frame, [CURSOR_IN, CURSOR_IN + 6, EXIT - 6, EXIT], [0, 1, 1, 0], clamp);

  const avatarSrc = resolveSrc(avatarImage);

  const margin = 80;
  const cardPxW = CARD_W * scale;
  const cardPxH = CARD_H * scale;
  const left =
    position === "bottom-left"
      ? margin
      : position === "bottom-right"
        ? width - margin - cardPxW
        : (width - cardPxW) / 2;
  const top = position === "center" ? (height - cardPxH) / 2 : height - margin - cardPxH;

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <div
        style={{
          position: "absolute",
          left,
          top,
          width: CARD_W,
          height: CARD_H,
          transformOrigin: "0 0",
          transform: `scale(${scale})`,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: CARD_H / 2,
            background: "rgba(18,18,18,0.92)",
            boxShadow: "0 18px 50px rgba(0,0,0,0.45)",
            border: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            paddingLeft: 26,
            gap: 24,
            opacity: Math.min(1, shown * 1.5),
            transform: `translateY(${(1 - shown) * 60}px) scale(${0.85 + 0.15 * shown})`,
          }}
        >
          <div
            style={{
              width: 98,
              height: 98,
              borderRadius: "50%",
              overflow: "hidden",
              background: accentColor,
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: 48,
              fontWeight: 700,
            }}
          >
            {avatarSrc ? (
              <Img src={avatarSrc} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              channelName.trim().charAt(0).toUpperCase()
            )}
          </div>
          <div style={{ color: "white", width: BTN_X - 26 - 98 - 24 - 20, overflow: "hidden" }}>
            <div style={{ fontSize: 36, fontWeight: 700, whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>
              {channelName}
            </div>
            <div style={{ fontSize: 24, color: "#aaa", marginTop: 4 }}>{subscriberText}</div>
          </div>

          <div
            style={{
              position: "absolute",
              left: BTN_X,
              top: (CARD_H - BTN_H) / 2,
              width: BTN_W,
              height: BTN_H,
              borderRadius: BTN_H / 2,
              background: subscribed ? "#3a3a3a" : accentColor,
              color: subscribed ? "#ddd" : "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 26,
              fontWeight: 700,
              letterSpacing: 0.5,
              transform: `scale(${1 - subPress * 0.08})`,
            }}
          >
            {subscribed ? "Subscribed" : "Subscribe"}
          </div>

          <div
            style={{
              position: "absolute",
              left: BELL_X,
              top: (CARD_H - BTN_H) / 2,
              width: BTN_H,
              height: BTN_H,
              borderRadius: "50%",
              background: bellActive ? accentColor : "#3a3a3a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: bellAppear,
              transform: `scale(${bellAppear * (1 - bellPress * 0.1)})`,
            }}
          >
            <BellIcon
              size={40}
              color="white"
              style={{ transform: `rotate(${bellAngle}deg)`, transformOrigin: "50% 15%" }}
            />
          </div>
        </div>

        <ClickRipple
          x={btnTarget.x}
          y={btnTarget.y - 6}
          t={interpolate(frame, [CLICK_SUB, CLICK_SUB + 16], [0, 1], clamp)}
        />
        <ClickRipple
          x={bellTarget.x}
          y={bellTarget.y - 6}
          t={interpolate(frame, [CLICK_BELL, CLICK_BELL + 16], [0, 1], clamp)}
        />
        <Cursor x={cx} y={cy} press={Math.max(subPress, bellPress)} opacity={cursorOpacity} />
      </div>
    </AbsoluteFill>
  );
};
