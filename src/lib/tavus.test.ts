import { afterEach, describe, expect, it, vi } from "vitest";
import { DEFAULT_FACE_ID, DEFAULT_PAL_ID } from "@/lib/constants";
import {
  TavusError,
  createConversation,
  createVideo,
  resolveConversationIds,
} from "@/lib/tavus";

describe("resolveConversationIds", () => {
  it("uses stock PAL and face IDs from the Tavus examples when none are provided", () => {
    expect(resolveConversationIds({})).toEqual({
      pal_id: DEFAULT_PAL_ID,
      face_id: DEFAULT_FACE_ID,
    });
  });

  it("prefers explicit PAL and face IDs", () => {
    expect(
      resolveConversationIds({ pal_id: "p-custom", face_id: "r-custom" })
    ).toEqual({
      pal_id: "p-custom",
      face_id: "r-custom",
    });
  });
});

describe("Tavus API client", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("creates a conversation with pal_id, face_id, and test_mode", async () => {
    vi.stubEnv("TAVUS_API_KEY", "tvsk_test");
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        conversation_id: "c-hello",
        conversation_url: "https://tavus.daily.co/c-hello",
        status: "ended",
      }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const conversation = await createConversation({
      conversation_name: "hello-world",
      test_mode: true,
    });

    expect(conversation.conversation_id).toBe("c-hello");
    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://tavusapi.com/v2/conversations");
    expect((init.headers as Record<string, string>)["x-api-key"]).toBe("tvsk_test");
    expect(JSON.parse(String(init.body))).toEqual({
      pal_id: DEFAULT_PAL_ID,
      face_id: DEFAULT_FACE_ID,
      conversation_name: "hello-world",
      test_mode: true,
    });
  });

  it("creates an async video from a script and replica_id", async () => {
    vi.stubEnv("TAVUS_API_KEY", "tvsk_test");
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        video_id: "v-hello",
        status: "queued",
        hosted_url: "https://tavus.video/v-hello",
      }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const video = await createVideo({
      replica_id: DEFAULT_FACE_ID,
      script: "Hello from Video Creator.",
      video_name: "hello-world",
    });

    expect(video.video_id).toBe("v-hello");
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://tavusapi.com/v2/videos");
    expect(JSON.parse(String(init.body))).toEqual({
      replica_id: DEFAULT_FACE_ID,
      script: "Hello from Video Creator.",
      video_name: "hello-world",
    });
  });

  it("throws a 503 when the API key is missing", async () => {
    vi.stubEnv("TAVUS_API_KEY", "");
    await expect(createConversation({ test_mode: true })).rejects.toBeInstanceOf(TavusError);
  });
});
