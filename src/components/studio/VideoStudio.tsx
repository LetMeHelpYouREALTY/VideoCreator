'use client';

import { GenerateVideo } from "@/components/studio/GenerateVideo";
import { SITE } from "@/lib/constants";
import dynamic from "next/dynamic";
import { useState } from "react";

const LiveConversation = dynamic(
  () => import("@/components/studio/LiveConversation").then((mod) => mod.LiveConversation),
  { ssr: false, loading: () => <p className="text-sm text-zinc-500">Loading conversation studio…</p> }
);

type Mode = "live" | "generate";

export function VideoStudio() {
  const [mode, setMode] = useState<Mode>("generate");

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 py-10">
      <header className="mb-8">
        <p className="text-sm font-medium text-[#6a0dad]">{SITE.businessName}</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">{SITE.name}</h1>
        <p className="mt-2 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
          Create listing videos with Tavus: generate a talking-head clip from a script, or start a
          live Conversational Video Interface session with a PAL and face.
        </p>
      </header>

      <div className="mb-6 flex gap-2">
        <button
          type="button"
          onClick={() => setMode("generate")}
          className={`rounded-full px-4 py-2 text-sm font-medium ${
            mode === "generate"
              ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
              : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
          }`}
        >
          Generate video
        </button>
        <button
          type="button"
          onClick={() => setMode("live")}
          className={`rounded-full px-4 py-2 text-sm font-medium ${
            mode === "live"
              ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
              : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
          }`}
        >
          Live conversation
        </button>
      </div>

      {mode === "generate" ? <GenerateVideo /> : <LiveConversation />}

      <footer className="mt-auto pt-10 text-sm text-zinc-600 dark:text-zinc-400">
        <p>
          {SITE.agentName} · {SITE.businessName} · {SITE.city}, {SITE.region} ·{" "}
          <a className="underline" href={SITE.phoneHref}>
            {SITE.phone}
          </a>
        </p>
      </footer>
    </div>
  );
}
