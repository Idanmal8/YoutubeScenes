import React from "react";

/** A mouse pointer. `press` (0..1) squashes it slightly to sell a click. */
export const Cursor: React.FC<{
  x: number;
  y: number;
  press?: number;
  size?: number;
  opacity?: number;
}> = ({ x, y, press = 0, size = 64, opacity = 1 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    style={{
      position: "absolute",
      left: x,
      top: y,
      opacity,
      transform: `scale(${1 - press * 0.18})`,
      transformOrigin: "15% 10%",
      filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.45))",
    }}
  >
    <path
      d="M4 2 L4 20.5 L8.6 16.3 L11.6 23 L14.9 21.6 L11.9 14.9 L18.3 14.9 Z"
      fill="#fff"
      stroke="#111"
      strokeWidth={1.3}
      strokeLinejoin="round"
    />
  </svg>
);

/** Expanding ring that marks a click. `t` runs 0..1 over the ripple's life. */
export const ClickRipple: React.FC<{
  x: number;
  y: number;
  t: number;
  color?: string;
  maxSize?: number;
}> = ({ x, y, t, color = "#fff", maxSize = 120 }) => {
  if (t <= 0 || t >= 1) return null;
  const s = maxSize * t;
  return (
    <div
      style={{
        position: "absolute",
        left: x - s / 2,
        top: y - s / 2,
        width: s,
        height: s,
        borderRadius: "50%",
        border: `${4 * (1 - t) + 1}px solid ${color}`,
        opacity: 1 - t,
      }}
    />
  );
};
