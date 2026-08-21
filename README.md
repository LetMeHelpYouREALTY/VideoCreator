# VideoCreator

Live conversational video for Dr. Jan Duffy at Berkshire Hathaway HomeServices Nevada Properties. Tavus renders the face. The Next.js app starts a CVI conversation. An optional LiveKit worker can run STT, LLM, and TTS while Tavus joins the same room as the avatar.

Office: 8850 W. Sunset Road, Suite 200, Las Vegas, NV 89148. Call 702-222-1964.

## Two paths

### 1. Tavus CVI (full pipeline)

Use this for the in-browser studio at `/studio`.

1. Create a PAL with `pipeline_mode: "full"`, Phoenix face `r90bbd427f71`, `raven-1` perception, and `sparrow-1` turn-taking.
2. Create a conversation with that `pal_id`.
3. Join the returned `conversation_url` through `@tavus/cvi-ui` `CVIProvider` + `Conversation`.

The API key stays on the server. The browser calls `POST /api/tavus`.

### 2. LiveKit Agent (Tavus face)

Use this when LiveKit should own the voice pipeline.

1. Install `agent/` dependencies.
2. Set LiveKit and Tavus credentials in `agent/.env.local`.
3. Run `npm run agent:dev`.
4. The worker starts `tavus.AvatarSession` with `faceId` **before** `AgentSession.start`.

Optional: create an echo-mode PAL with `layers.transport.transport_type: "livekit"` and set `TAVUS_PAL_ID`. If omitted, the plugin uses a stock LiveKit PAL.

## Setup

```bash
cp .env.example .env.local
npm install
```

Create a PAL (server-side):

```bash
curl --request POST \
  --url http://localhost:3000/api/tavus/pal \
  --header 'Content-Type: application/json' \
  --header "x-setup-token: $TAVUS_SETUP_TOKEN" \
  --data '{"kind":"full"}'
```

Put the returned `pal_id` in `.env.local` as `TAVUS_PAL_ID`.

```bash
npm run dev
```

Open [http://localhost:3000/studio](http://localhost:3000/studio).

### LiveKit worker

```bash
cp agent/.env.example agent/.env.local
npm run agent:install
npm run agent:dev
```

## Environment

| Variable | Where | Purpose |
| --- | --- | --- |
| `TAVUS_API_KEY` | server | Tavus `x-api-key`. Never expose to the browser. |
| `TAVUS_PAL_ID` | server / agent | Full-pipeline PAL for CVI, or echo PAL for LiveKit. |
| `TAVUS_FACE_ID` | server / agent | Defaults to stock Anna `r90bbd427f71`. |
| `TAVUS_SETUP_TOKEN` | server | Optional guard for `POST /api/tavus/pal`. |
| `LIVEKIT_URL` | agent | LiveKit Cloud or self-hosted URL. |
| `LIVEKIT_API_KEY` | agent | LiveKit API key. |
| `LIVEKIT_API_SECRET` | agent | LiveKit API secret. |

Get a Tavus key in [PAL Maker](https://maker.tavus.io/dev/api-keys).

## Docs used

- [Tavus documentation index](https://docs.tavus.io/llms.txt)
- [API Conversation Quickstart](https://docs.tavus.io/sections/conversational-video-interface/quickstart/cvi-quickstart)
- [LiveKit Agent](https://docs.tavus.io/sections/integrations/livekit)
- [Tavus examples](https://github.com/Tavus-Engineering/tavus-examples)
- [LiveKit Tavus plugin](https://docs.livekit.io/agents/models/avatar/plugins/tavus)

## Scripts

```bash
npm run test
npm run lint
npm run typecheck
```
