import { Composition, Folder } from "remotion";
import { transparentMetadata } from "./lib/transparent";
import {
  THUMBNAIL_SCROLL_DURATION,
  ThumbnailScroll,
  thumbnailScrollSchema,
} from "./scenes/ThumbnailScroll";
import {
  SUBSCRIBE_REMINDER_DURATION,
  SubscribeReminder,
  subscribeReminderSchema,
} from "./scenes/SubscribeReminder";
import {
  LIKE_SHARE_SUBSCRIBE_DURATION,
  LikeShareSubscribe,
  likeShareSubscribeSchema,
} from "./scenes/LikeShareSubscribe";
import { LOWER_THIRD_DURATION, LowerThird, lowerThirdSchema } from "./scenes/LowerThird";
import {
  SWIPE_TRANSITION_DURATION,
  SwipeTransition,
  swipeTransitionSchema,
} from "./scenes/SwipeTransition";

const video = { fps: 30, width: 1920, height: 1080 };

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="Transitions">
        <Composition
          id="ThumbnailScroll"
          component={ThumbnailScroll}
          schema={thumbnailScrollSchema}
          durationInFrames={THUMBNAIL_SCROLL_DURATION}
          {...video}
          defaultProps={{
            featuredImage: "",
            featuredTitle: "I Built This in 24 Hours",
            channelName: "Your Channel",
            otherImages: [],
            backgroundColor: "#0f0f0f",
            accentColor: "#ff0033",
            curveStrength: 1,
          }}
        />
        <Composition
          id="SwipeTransition"
          component={SwipeTransition}
          schema={swipeTransitionSchema}
          durationInFrames={SWIPE_TRANSITION_DURATION}
          {...video}
          calculateMetadata={transparentMetadata}
          defaultProps={{
            colors: ["#ff0033", "#ffffff", "#0f0f0f"],
            direction: "left-to-right" as const,
            angle: 12,
          }}
        />
      </Folder>

      <Folder name="Overlays">
        <Composition
          id="SubscribeReminder"
          component={SubscribeReminder}
          schema={subscribeReminderSchema}
          durationInFrames={SUBSCRIBE_REMINDER_DURATION}
          {...video}
          calculateMetadata={transparentMetadata}
          defaultProps={{
            channelName: "Your Channel",
            subscriberText: "1.2M subscribers",
            avatarImage: "",
            position: "bottom-center" as const,
            accentColor: "#ff0033",
            scale: 1,
          }}
        />
        <Composition
          id="LikeShareSubscribe"
          component={LikeShareSubscribe}
          schema={likeShareSubscribeSchema}
          durationInFrames={LIKE_SHARE_SUBSCRIBE_DURATION}
          {...video}
          calculateMetadata={transparentMetadata}
          defaultProps={{
            likeLabel: "Like",
            shareLabel: "Share",
            subscribeLabel: "Subscribe",
            likeColor: "#3ea6ff",
            shareColor: "#22c55e",
            subscribeColor: "#ff0033",
            position: "center" as const,
            scale: 1,
          }}
        />
        <Composition
          id="LowerThird"
          component={LowerThird}
          schema={lowerThirdSchema}
          durationInFrames={LOWER_THIRD_DURATION}
          {...video}
          calculateMetadata={transparentMetadata}
          defaultProps={{
            name: "Your Name",
            title: "Creator & Developer",
            accentColor: "#ff0033",
            boxColor: "#ffffff",
            textColor: "#0f0f0f",
            side: "left" as const,
          }}
        />
      </Folder>
    </>
  );
};
