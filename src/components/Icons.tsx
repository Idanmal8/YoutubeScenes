import React from "react";

type IconProps = { size: number; color: string; style?: React.CSSProperties };

const Svg: React.FC<IconProps & { d: string }> = ({ size, color, style, d }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={style}>
    <path d={d} fill={color} />
  </svg>
);

export const ThumbUpIcon: React.FC<IconProps> = (p) => (
  <Svg
    {...p}
    d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"
  />
);

export const ShareIcon: React.FC<IconProps> = ({ style, ...p }) => (
  <Svg
    {...p}
    style={{ transform: "scaleX(-1)", ...style }}
    d="M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z"
  />
);

export const BellIcon: React.FC<IconProps> = (p) => (
  <Svg
    {...p}
    d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"
  />
);

export const PlayIcon: React.FC<IconProps> = (p) => (
  <Svg {...p} d="M8 5v14l11-7z" />
);
