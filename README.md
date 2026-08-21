# VideoCreator

Live conversational video for Dr. Jan Duffy at Berkshire Hathaway HomeServices Nevada Properties.

The happy path is the [API Conversation Quickstart](https://docs.tavus.io/sections/conversational-video-interface/quickstart/cvi-quickstart) wrapped in a Next.js app per the [CVI App Quickstart](https://docs.tavus.io/sections/conversational-video-interface/quickstart/build-first-app):

1. Create a full-pipeline PAL.
2. Create a conversation with that `pal_id`.
3. Join `conversation_url`. End the conversation when the user leaves.

`TAVUS_API_KEY` stays on the server. The browser never sees it.

Office: 8850 W. Sunset Road, Suite 200, Las Vegas, NV 89148. Call 702-222-1964.

## Step 1: Create a PAL

Phoenix-4 Pro face `r90bbd427f71` (stock Anna), `raven-1` perception, `sparrow-1` turn-taking with high patience:

```bash
curl --request POST \
  --url https://tavusapi.com/v2/pals \
  --header 'Content-Type: application/json' \
  --header "x-api-key: $TAVUS_API_KEY" \
  --data '{
    "pal_name": "Interviewer",
    "system_prompt": "As an Interviewer, you are a skilled professional who conducts thoughtful and structured interviews. Your aim is to ask insightful questions, listen carefully, and assess responses objectively to identify the best candidates.",
    "pipeline_mode": "full",
    "context": "You have a track record of conducting interviews that put candidates at ease, draw out their strengths, and help organizations make excellent hiring decisions.",
    "default_face_id": "r90bbd427f71",
    "layers": {
      "perception": {
        "perception_model": "raven-1"
      },
      "conversational_flow": {
        "turn_detection_model": "sparrow-1",
        "turn_taking_patience": "high",
        "pal_interruptibility": "medium"
      }
    }
  }'
```

Or from this app (default kind is `interviewer`):

```bash
curl --request POST \
  --url http://localhost:3000/api/tavus/pal \
  --header 'Content-Type: application/json' \
  --header "x-setup-token: $TAVUS_SETUP_TOKEN" \
  --data '{"kind":"interviewer"}'
```

Put the returned `pal_id` in `.env.local` as `TAVUS_PAL_ID`. If you skip this, the studio uses stock PAL `pcb7a34da5fe`.

`kind` values: `interviewer` (docs example), `full` (Las Vegas realtor PAL), `livekit` (echo transport for the optional worker).

## Step 2: Create a conversation

```bash
curl --request POST \
  --url https://tavusapi.com/v2/conversations \
  --header 'Content-Type: application/json' \
  --header "x-api-key: $TAVUS_API_KEY" \
  --data '{
    "pal_id": "<your_pal_id>",
    "conversation_name": "Interview User"
  }'
```

The studio does the same through `POST /api/tavus`. If the PAL already has `default_face_id`, only `pal_id` is sent.

Use `test_mode: true` while wiring the integration. Tavus returns `status: "ended"` and the PAL does not join, so it does not count toward billing.

## Step 3: Join conversation_url

The create response includes the join URL:

```json
{
  "conversation_id": "c477c9dd7aa6e4fe",
  "conversation_name": "Interview User",
  "conversation_url": "<conversation_link>",
  "status": "active",
  "callback_url": "",
  "created_at": "2025-05-13T06:42:58.291561Z"
}
```

`/studio` embeds that URL with `CVIProvider` + `Conversation` from the Tavus CVI UI examples. Leaving the call hits End Conversation.

## Setup

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000/studio](http://localhost:3000/studio).

## LiveKit (optional)

LiveKit is not the recommended CVI path. Use it only if you already run a LiveKit Agents pipeline and want Tavus as the avatar renderer.

```bash
cp agent/.env.example agent/.env.local
npm run agent:install
npm run agent:dev
```

Create a separate echo PAL (`{"kind":"livekit"}`) and set `TAVUS_LIVEKIT_PAL_ID`. Do not reuse the full-pipeline PAL.

## Environment

| Variable | Purpose |
| --- | --- |
| `TAVUS_API_KEY` | Server-only Tavus `x-api-key`. |
| `TAVUS_PAL_ID` | Full-pipeline PAL. Falls back to stock `pcb7a34da5fe`. |
| `TAVUS_FACE_ID` | Optional face override. Omit to use the PAL default face. |
| `TAVUS_SETUP_TOKEN` | Optional guard for `POST /api/tavus/pal`. |
| `LIVEKIT_*` / `TAVUS_LIVEKIT_PAL_ID` | Optional LiveKit worker. |

Get a key in [PAL Maker](https://maker.tavus.io/dev/api-keys).

## Docs

- [Tavus llms.txt](https://docs.tavus.io/llms.txt)
- [API Conversation Quickstart](https://docs.tavus.io/sections/conversational-video-interface/quickstart/cvi-quickstart)
- [CVI App Quickstart](https://docs.tavus.io/sections/conversational-video-interface/quickstart/build-first-app)
- [CVI UI component library](https://docs.tavus.io/sections/conversational-video-interface/component-library/overview)
- [Tavus examples](https://github.com/Tavus-Engineering/tavus-examples)
