'use client';

import { CVIProvider } from "@/components/cvi/components/cvi-provider";
import { HairCheck } from "@/components/cvi/components/hair-check";
import { Conversation } from "@/components/cvi/components/conversation";
import { DEFAULT_FACE_ID, DEFAULT_PAL_ID } from "@/lib/constants";
import type { TavusConversation } from "@/types/tavus";
import { useCallback, useEffect, useState } from "react";

type Screen = "welcome" | "hairCheck" | "call";

type LiveConversationProps = {
  testMode?: boolean;
};

export function LiveConversation({ testMode = false }: LiveConversationProps) {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [conversation, setConversation] = useState<TavusConversation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cleanup = useCallback(async (conversationId?: string) => {
    const id = conversationId ?? conversation?.conversation_id;
    if (!id) return;
    await fetch(`/api/conversations/${id}/end`, { method: "POST" }).catch(() => undefined);
  }, [conversation?.conversation_id]);

  useEffect(() => {
    return () => {
      if (conversation?.conversation_id && conversation.status === "active") {
        void cleanup(conversation.conversation_id);
      }
    };
  }, [cleanup, conversation]);

  async function startHairCheck() {
    setError(null);
    setScreen("hairCheck");
  }

  async function joinCall() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pal_id: DEFAULT_PAL_ID,
          face_id: DEFAULT_FACE_ID,
          conversation_name: "Video Creator live session",
          custom_greeting:
            "Hi, I'm here to help create a listing video. Tell me the property address and what you want viewers to know.",
          test_mode: testMode,
        }),
      });
      const data = (await response.json()) as TavusConversation & { error?: string };
      if (!response.ok) {
        throw new Error(data.error || "Failed to create conversation");
      }
      if (testMode || !data.conversation_url || data.status === "ended") {
        setConversation(data);
        setScreen("welcome");
        return;
      }
      setConversation(data);
      setScreen("call");
    } catch (joinError) {
      setError(joinError instanceof Error ? joinError.message : "Failed to start conversation");
      setScreen("welcome");
    } finally {
      setLoading(false);
    }
  }

  async function handleLeave() {
    await cleanup();
    setConversation(null);
    setScreen("welcome");
  }

  return (
    <CVIProvider>
      {screen === "welcome" ? (
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="text-xl font-semibold">Live CVI conversation</h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Start a real-time video call with a Tavus PAL and face. Camera and microphone
            permissions are requested before the PAL joins.
          </p>
          <button
            type="button"
            onClick={startHairCheck}
            className="mt-6 rounded-md bg-[#6a0dad] px-4 py-2 text-sm font-medium text-white hover:bg-[#5a0b94]"
          >
            Start conversation
          </button>
          {conversation && testMode ? (
            <p className="mt-4 text-sm text-emerald-700" role="status">
              Test conversation created: {conversation.conversation_id} ({conversation.status})
            </p>
          ) : null}
          {error ? (
            <p className="mt-4 text-sm text-red-600" role="alert">
              {error}
            </p>
          ) : null}
        </div>
      ) : null}

      {screen === "hairCheck" ? (
        <HairCheck
          isJoinBtnLoading={loading}
          onJoin={joinCall}
          onCancel={() => setScreen("welcome")}
        />
      ) : null}

      {screen === "call" && conversation?.conversation_url ? (
        <div className="h-[70vh] min-h-[480px] w-full">
          <Conversation conversationUrl={conversation.conversation_url} onLeave={handleLeave} />
        </div>
      ) : null}
    </CVIProvider>
  );
}
