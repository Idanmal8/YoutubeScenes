import { loadFont } from "@remotion/google-fonts/Roboto";

export const { fontFamily } = loadFont("normal", {
  weights: ["400", "500", "700", "900"],
  subsets: ["latin"],
});
