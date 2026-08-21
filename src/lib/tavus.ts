import { DEFAULT_FACE_ID, DEFAULT_PAL_ID, TAVUS_API_BASE } from "@/lib/constants";
import type {
  CreateConversationInput,
  CreateVideoInput,
  TavusConversation,
  TavusFace,
  TavusPal,
  TavusVideo,
} from "@/types/tavus";

export class TavusError extends Error {
  status: number;
  body: unknown;

  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.name = "TavusError";
    this.status = status;
    this.body = body;
  }
}

export function getTavusApiKey(): string | null {
  const key = process.env.TAVUS_API_KEY?.trim();
  return key ? key : null;
}

export function requireTavusApiKey(): string {
  const key = getTavusApiKey();
  if (!key) {
    throw new TavusError(
      "Missing TAVUS_API_KEY. Add it in Vercel project settings or a local .env.local file.",
      503,
      { error: "missing_api_key" }
    );
  }
  return key;
}

export async function tavusRequest<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const apiKey = requireTavusApiKey();
  const response = await fetch(`${TAVUS_API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      ...(init.headers ?? {}),
    },
    cache: "no-store",
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const data: unknown = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      (typeof data === "object" &&
        data !== null &&
        "error" in data &&
        typeof data.error === "string" &&
        data.error) ||
      (typeof data === "object" &&
        data !== null &&
        "message" in data &&
        typeof data.message === "string" &&
        data.message) ||
      `Tavus request failed (${response.status})`;
    throw new TavusError(message, response.status, data);
  }

  return data as T;
}

export function resolveConversationIds(input: CreateConversationInput): {
  pal_id: string;
  face_id?: string;
} {
  const palId = input.pal_id?.trim() || process.env.TAVUS_PAL_ID?.trim() || DEFAULT_PAL_ID;
  const faceId =
    input.face_id?.trim() || process.env.TAVUS_FACE_ID?.trim() || DEFAULT_FACE_ID;

  return faceId ? { pal_id: palId, face_id: faceId } : { pal_id: palId };
}

export async function createConversation(
  input: CreateConversationInput = {}
): Promise<TavusConversation> {
  const ids = resolveConversationIds(input);

  return tavusRequest<TavusConversation>("/conversations", {
    method: "POST",
    body: JSON.stringify({
      pal_id: ids.pal_id,
      ...(ids.face_id ? { face_id: ids.face_id } : {}),
      conversation_name: input.conversation_name ?? "Video Creator session",
      ...(input.conversational_context
        ? { conversational_context: input.conversational_context }
        : {}),
      ...(input.custom_greeting ? { custom_greeting: input.custom_greeting } : {}),
      test_mode: Boolean(input.test_mode),
    }),
  });
}

export async function endConversation(conversationId: string): Promise<void> {
  await tavusRequest<void>(`/conversations/${conversationId}/end`, {
    method: "POST",
  });
}

export async function createVideo(input: CreateVideoInput): Promise<TavusVideo> {
  return tavusRequest<TavusVideo>("/videos", {
    method: "POST",
    body: JSON.stringify({
      replica_id: input.replica_id,
      script: input.script,
      video_name: input.video_name ?? "Video Creator clip",
    }),
  });
}

export async function getVideo(videoId: string): Promise<TavusVideo> {
  return tavusRequest<TavusVideo>(`/videos/${videoId}`);
}

export async function listStockFaces(limit = 12): Promise<TavusFace[]> {
  const data = await tavusRequest<{ data?: TavusFace[] }>(
    `/faces?face_type=system&verbose=true&limit=${limit}`
  );
  return data.data ?? [];
}

export async function listStockPals(limit = 12): Promise<TavusPal[]> {
  const data = await tavusRequest<{ data?: TavusPal[] }>(
    `/pals?pal_type=system&limit=${limit}`
  );
  return data.data ?? [];
}

export function errorResponse(error: unknown): { body: unknown; status: number } {
  if (error instanceof TavusError) {
    return {
      status: error.status,
      body: { error: error.message, details: error.body },
    };
  }

  return {
    status: 500,
    body: {
      error: error instanceof Error ? error.message : "Unexpected error",
    },
  };
}
