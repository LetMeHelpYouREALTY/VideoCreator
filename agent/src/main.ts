import {
  ServerOptions,
  cli,
  defineAgent,
  inference,
  voice,
} from '@livekit/agents'
import * as tavus from '@livekit/agents-plugin-tavus'
import dotenv from 'dotenv'
import { fileURLToPath } from 'node:url'
import { AGENT_INSTRUCTIONS } from './instructions.ts'

dotenv.config({ path: '.env.local' })
dotenv.config({ path: '../.env.local' })

const STOCK_ANNA_FACE_ID = 'r90bbd427f71'

export default defineAgent({
  entry: async (ctx) => {
    await ctx.connect()

    const session = new voice.AgentSession({
      stt: new inference.STT({
        model: 'assemblyai/universal-3-5-pro',
        language: 'en',
      }),
      llm: new inference.LLM({
        model: 'openai/gpt-4.1-mini',
      }),
      tts: new inference.TTS({
        model: 'cartesia/sonic-3',
        voice: '9626c31c-bec5-4cca-baa8-f8ba9e84c8bc',
      }),
      turnHandling: {
        turnDetection: new inference.TurnDetector(),
      },
    })

    const avatar = new tavus.AvatarSession({
      faceId: process.env.TAVUS_FACE_ID || STOCK_ANNA_FACE_ID,
      palId: process.env.TAVUS_LIVEKIT_PAL_ID || undefined,
      avatarParticipantName: 'Dr-Jan-Duffy-avatar',
    })

    // Start the avatar first so it joins before the session pipes audio out.
    await avatar.start(session, ctx.room)
    await avatar.waitForJoin()

    await session.start({
      agent: new voice.Agent({
        instructions: AGENT_INSTRUCTIONS,
      }),
      room: ctx.room,
    })

    session.generateReply({
      instructions:
        'Greet the caller in eight to fifteen words and ask which Las Vegas listing or neighborhood they want to walk through.',
    })
  },
})

cli.runApp(
  new ServerOptions({
    agent: fileURLToPath(import.meta.url),
    agentName: 'videocreator-tavus-avatar',
  }),
)
