# Video Creator

Next.js 15 app for [Let Me Help You Realty](https://github.com/LetMeHelpYouREALTY/VideoCreator). It creates Tavus **async talking-head videos** from a script and starts **live CVI conversations** with a PAL and face.

The live UI follows the official [`cvi-ui-haircheck-conversation`](https://github.com/Tavus-Engineering/tavus-examples/tree/main/examples/cvi-ui-haircheck-conversation) example (welcome → hair check → Daily-powered conversation). Conversation and video requests are created on the server so `TAVUS_API_KEY` never ships to the browser ([CVI App Quickstart](https://docs.tavus.io/sections/conversational-video-interface/quickstart/build-first-app)).

## Setup

```bash
pnpm install
cp .env.example .env.local
```

Set `TAVUS_API_KEY` from the [Tavus PAL Maker](https://maker.tavus.io/dev/api-keys). Optional:

- `TAVUS_PAL_ID` (default `p48fdf065d6b`, stock demo PAL from the Tavus examples)
- `TAVUS_FACE_ID` (default `r90bbd427f71`, stock Anna face)

## Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

- **Generate video** submits `POST /api/videos` → Tavus `POST /v2/videos`
- **Live conversation** submits `POST /api/conversations` → Tavus `POST /v2/conversations`

```bash
pnpm lint
pnpm test
pnpm typecheck
```

## Vercel

This repo is a Next.js app at the repository root (`package.json` includes `next`). Add `TAVUS_API_KEY` in the Vercel project environment variables. Production auto-deploys from `main`.
