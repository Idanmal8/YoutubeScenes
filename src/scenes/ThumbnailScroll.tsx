import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  random,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import { zColor } from "@remotion/zod-types";
import { resolveSrc } from "../lib/assets";
import { fontFamily } from "../lib/fonts";
import { PlayIcon } from "../components/Icons";

export const thumbnailScrollSchema = z.object({
  featuredImage: z
    .string()
    .describe("Your thumbnail: URL or path inside public/ (e.g. thumbs/ep12.jpg)"),
  featuredTitle: z.string(),
  channelName: z.string(),
  otherImages: z
    .array(z.string())
    .describe("Optional filler thumbnails; generated placeholders are used otherwise"),
  backgroundColor: zColor(),
  accentColor: zColor(),
  curveStrength: z.number().min(0).max(2).step(0.05),
});

export type ThumbnailScrollProps = z.infer<typeof thumbnailScrollSchema>;

export const THUMBNAIL_SCROLL_DURATION = 165;

// ---- Grid layout (world space, in px at 1920 wide) ----
const W = 1920;
const H = 1080;
const COLS = 4;
const PAD = 56;
const GAP = 28;
const CARD_W = (W - PAD * 2 - GAP * (COLS - 1)) / COLS;
const THUMB_H = (CARD_W * 9) / 16;
const ROW_H = THUMB_H + 150;
const ROWS = 15;
const FEATURED_ROW = 11;
const FEATURED_COL = 1;

const FEATURED_X = PAD + FEATURED_COL * (CARD_W + GAP) + CARD_W / 2;
const FEATURED_Y = PAD + FEATURED_ROW * ROW_H + THUMB_H / 2;
const END_ZOOM = W / CARD_W;

// ---- Timeline (frames) ----
const SCROLL_END = 95;
const HIGHLIGHT_START = 85;
const ZOOM_START = 105;
const ZOOM_END = 142;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const scrollEase = Easing.bezier(0.55, 0, 0.12, 1);
const zoomEase = Easing.bezier(0.7, 0, 0.18, 1);

const camYAt = (f: number) =>
  interpolate(f, [0, SCROLL_END], [H / 2, FEATURED_Y], {
    ...clamp,
    easing: scrollEase,
  });

const PlaceholderThumb: React.FC<{ seed: number }> = ({ seed }) => {
  const hue = Math.floor(random(`h${seed}`) * 360);
  const hue2 = (hue + 40 + random(`h2${seed}`) * 60) % 360;
  const angle = Math.floor(random(`a${seed}`) * 180);
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${angle}deg, hsl(${hue} 65% 42%), hsl(${hue2} 70% 22%))`,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "8%",
          bottom: "12%",
          width: `${40 + random(`w${seed}`) * 35}%`,
          height: "16%",
          borderRadius: 6,
          background: "rgba(255,255,255,0.22)",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: "9%",
          top: "18%",
          width: "26%",
          aspectRatio: "1",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.12)",
        }}
      />
    </AbsoluteFill>
  );
};

const FeaturedPlaceholder: React.FC<{ accent: string }> = ({ accent }) => (
  <AbsoluteFill
    style={{
      background: `linear-gradient(135deg, ${accent}, #1a1a1a)`,
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      fontFamily,
      fontWeight: 900,
      fontSize: 34,
      letterSpacing: 2,
      flexDirection: "column",
      gap: 8,
    }}
  >
    <PlayIcon size={64} color="white" />
    YOUR THUMBNAIL
  </AbsoluteFill>
);

const Card: React.FC<{
  index: number;
  featured: boolean;
  props: ThumbnailScrollProps;
  highlight: number;
  cornerRadius: number;
  metaOpacity: number;
}> = ({ index, featured, props, highlight, cornerRadius, metaOpacity }) => {
  const imgList = props.otherImages.filter(Boolean);
  const filler = imgList.length ? resolveSrc(imgList[index % imgList.length]) : null;
  const featuredSrc = resolveSrc(props.featuredImage);
  const titleW1 = 70 + random(`t1${index}`) * 28;
  const titleW2 = 35 + random(`t2${index}`) * 35;

  return (
    <div style={{ width: CARD_W, height: ROW_H, fontFamily }}>
      <div
        style={{
          position: "relative",
          width: CARD_W,
          height: THUMB_H,
          borderRadius: cornerRadius,
          overflow: "hidden",
          background: "#222",
          boxShadow: featured
            ? `0 0 0 ${highlight * 5}px ${props.accentColor}, 0 ${highlight * 20}px ${highlight * 50}px rgba(0,0,0,0.6)`
            : undefined,
        }}
      >
        {featured ? (
          featuredSrc ? (
            <Img src={featuredSrc} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <FeaturedPlaceholder accent={props.accentColor} />
          )
        ) : filler ? (
          <Img src={filler} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <PlaceholderThumb seed={index} />
        )}
        <div
          style={{
            position: "absolute",
            right: 10,
            bottom: 10,
            padding: "3px 7px",
            borderRadius: 5,
            background: "rgba(0,0,0,0.8)",
            color: "white",
            fontSize: 17,
            fontWeight: 500,
            opacity: metaOpacity,
          }}
        >
          {featured ? "12:34" : `${2 + Math.floor(random(`d${index}`) * 40)}:${String(Math.floor(random(`s${index}`) * 60)).padStart(2, "0")}`}
        </div>
      </div>

      <div style={{ display: "flex", gap: 14, marginTop: 16, opacity: metaOpacity }}>
        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: "50%",
            flexShrink: 0,
            background: featured
              ? props.accentColor
              : `hsl(${Math.floor(random(`av${index}`) * 360)} 40% 45%)`,
          }}
        />
        {featured ? (
          <div style={{ color: "white", minWidth: 0 }}>
            <div style={{ fontSize: 24, fontWeight: 500, lineHeight: 1.25 }}>
              {props.featuredTitle}
            </div>
            <div style={{ fontSize: 19, color: "#aaa", marginTop: 6 }}>
              {props.channelName}
            </div>
          </div>
        ) : (
          <div style={{ flex: 1 }}>
            <div style={{ height: 20, width: `${titleW1}%`, borderRadius: 4, background: "#3a3a3a" }} />
            <div style={{ height: 20, width: `${titleW2}%`, borderRadius: 4, background: "#3a3a3a", marginTop: 10 }} />
            <div style={{ height: 16, width: "40%", borderRadius: 4, background: "#2a2a2a", marginTop: 14 }} />
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Scrolls a YouTube-style feed with a speed-driven cylindrical curve, settles on
 * the featured card, highlights it, then zooms until the thumbnail fills the
 * frame. Cut to your clip on the last frame for a seamless transition.
 */
export const ThumbnailScroll: React.FC<ThumbnailScrollProps> = (props) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const camY = camYAt(frame);
  const zoomT = interpolate(frame, [ZOOM_START, ZOOM_END], [0, 1], { ...clamp, easing: zoomEase });
  const zoom = interpolate(zoomT, [0, 1], [1, END_ZOOM]);
  const camX = interpolate(zoomT, [0, 1], [W / 2, FEATURED_X]);

  // The faster we scroll, the more the feed bends around a drum.
  const velocity = Math.abs(camYAt(frame + 1) - camYAt(frame - 1)) / 2;
  const curve = Math.min(1, velocity / 55) * props.curveStrength;
  const radius = curve > 0.001 ? 1100 / curve : Infinity;

  const highlight = interpolate(frame, [HIGHLIGHT_START, HIGHLIGHT_START + 12, ZOOM_END - 10, ZOOM_END], [0, 1, 1, 0], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const pop = interpolate(frame, [HIGHLIGHT_START, HIGHLIGHT_START + 8, HIGHLIGHT_START + 18], [1, 1.05, 1], clamp);
  const cornerRadius = interpolate(zoomT, [0, 0.8, 1], [14, 8, 0]);
  const othersOpacity = interpolate(frame, [HIGHLIGHT_START, ZOOM_START + 10], [1, 0.35], clamp);
  const featuredMeta = interpolate(zoomT, [0, 0.4], [1, 0], clamp);

  const scale = width / W; // allow rendering at other resolutions

  return (
    <AbsoluteFill style={{ backgroundColor: props.backgroundColor, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          width: W,
          height: H,
          transform: `scale(${scale})`,
          transformOrigin: "0 0",
          perspective: 1800,
          perspectiveOrigin: "50% 50%",
        }}
      >
        {Array.from({ length: ROWS }, (_, row) => {
          const rowCenterY = PAD + row * ROW_H + ROW_H / 2;
          const sy = (rowCenterY - camY) * zoom;
          if (Math.abs(sy) > height / scale + ROW_H * zoom * 2) return null;

          let ty = sy;
          let tz = 0;
          let theta = 0;
          if (Number.isFinite(radius)) {
            theta = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, sy / radius));
            ty = radius * Math.sin(theta);
            tz = radius * (Math.cos(theta) - 1);
          }
          const isFeaturedRow = row === FEATURED_ROW;

          return (
            <div
              key={row}
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: W,
                height: ROW_H,
                transformOrigin: "0 0",
                transform: `translate3d(${W / 2 - camX * zoom}px, ${H / 2 + ty}px, ${tz}px) rotateX(${-theta}rad) scale(${zoom}) translateY(${-ROW_H / 2}px)`,
              }}
            >
              {Array.from({ length: COLS }, (_, col) => {
                const featured = isFeaturedRow && col === FEATURED_COL;
                return (
                  <div
                    key={col}
                    style={{
                      position: "absolute",
                      left: PAD + col * (CARD_W + GAP),
                      top: 0,
                      opacity: featured ? 1 : othersOpacity,
                      transform: featured ? `scale(${pop})` : undefined,
                      transformOrigin: `50% ${THUMB_H / 2}px`,
                      zIndex: featured ? 1 : 0,
                    }}
                  >
                    <Card
                      index={row * COLS + col}
                      featured={featured}
                      props={props}
                      highlight={featured ? highlight : 0}
                      cornerRadius={featured ? cornerRadius : 14}
                      metaOpacity={featured ? featuredMeta : 1}
                    />
                  </div>
                );
              })}
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
