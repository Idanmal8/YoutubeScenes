import { staticFile } from "remotion";

/**
 * Accepts either a remote URL / data URI, or a path relative to `public/`
 * (e.g. "thumbnails/my-thumb.jpg"). Returns null for empty strings so scenes
 * can fall back to a generated placeholder.
 */
export const resolveSrc = (src: string | undefined): string | null => {
  if (!src) return null;
  if (/^(https?:|data:|blob:)/.test(src)) return src;
  return staticFile(src.replace(/^\/+/, ""));
};
