/**
 * Default export settings for overlay scenes: ProRes 4444 with alpha, which
 * drops straight onto a track in Premiere / Final Cut / DaVinci Resolve.
 */
export const transparentMetadata = () => ({
  defaultCodec: "prores" as const,
  defaultVideoImageFormat: "png" as const,
  defaultPixelFormat: "yuva444p10le" as const,
  defaultProResProfile: "4444" as const,
});
