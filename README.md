# YoutubeScenes

Motion graphics templates for YouTube videos, built in code with [Remotion](https://remotion.dev) (React → video).
Each scene has settings you can change (text, colours, images) and renders to a file you drop into your editor.

## Scenes

| ID | Type | Output | What it does |
| --- | --- | --- | --- |
| `ThumbnailScroll` | Transition | MP4 | Scrolls a YouTube-style feed that bends like a drum while it moves fast, slows down on **your thumbnail**, highlights it, and zooms in until it fills the screen. Cut to your clip on the last frame. |
| `SwipeTransition` | Transition | MOV + alpha | Coloured diagonal bands sweep across. The screen is fully covered at the middle frame, so put your cut there. |
| `SubscribeReminder` | Overlay | MOV + alpha | Channel card. A cursor clicks Subscribe, then the bell, and the bell rings. |
| `LikeShareSubscribe` | Overlay | MOV + alpha | Like / Share / Subscribe buttons pop in one after another, and each one triggers. |
| `LowerThird` | Overlay | MOV + alpha | Name and title bar that wipes in, then back out. |

Overlays render as **ProRes 4444 with transparency**. Put them on a track above your footage in Premiere, Final Cut, or DaVinci Resolve.

## Usage

```bash
npm install
npm run dev          # opens Remotion Studio: preview and edit settings in the right-hand panel
```

### Injecting your images

Put images in `public/` (for example `public/thumbnails/ep12.jpg`) and set the setting to `thumbnails/ep12.jpg`.
A full `https://…` URL also works. If you leave an image empty, the scene draws a placeholder.

### Rendering

Studio has a **Render** button. From the command line:

```bash
# Default settings
npx remotion render ThumbnailScroll out/thumb-scroll.mp4

# Custom settings
npx remotion render ThumbnailScroll out/ep12.mp4 \
  --props='{"featuredImage":"thumbnails/ep12.jpg","featuredTitle":"I Built This in 24 Hours","channelName":"Idan","otherImages":[],"backgroundColor":"#0f0f0f","accentColor":"#ff0033","curveStrength":1}'

npx remotion render SubscribeReminder out/subscribe.mov --props='{"channelName":"Idan","subscriberText":"10K subscribers","avatarImage":"","position":"bottom-right","accentColor":"#ff0033","scale":1}'

# Every scene, default settings
npm run render:all
```

## Adding a new scene

1. Create `src/scenes/MyScene.tsx`. It exports a component, a zod schema (this is what makes the settings editable in Studio), and a duration.
2. Register it in `src/Root.tsx`. For an overlay, add `calculateMetadata={transparentMetadata}`.
3. Animate only with `useCurrentFrame()` + `interpolate()` / `spring()`. CSS animations and transitions don't render.

Shared building blocks are in `src/components` (icons, cursor, click ripple) and `src/lib` (image path handling, fonts, transparent export settings).

## Ideas backlog

- Like-button "smash" with confetti
- "Comment below" speech bubble
- End screen with 2 video placeholders and a subscribe slot
- Chapter title card / section divider
- Notification-bell popup ("New video from …")
- Progress bar / timeline marker
- Glitch, zoom-punch, and whip-pan transitions
