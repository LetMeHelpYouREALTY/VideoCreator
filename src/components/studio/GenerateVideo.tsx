'use client';

import { DEFAULT_FACE_ID } from "@/lib/constants";
import type { TavusVideo } from "@/types/tavus";
import { useEffect, useState, type FormEvent } from "react";

const SAMPLE_SCRIPT =
  "Hi, this is Dr. Jan Duffy with Let Me Help You Realty in Las Vegas. This Video Creator studio turns a listing script into a talking-head video you can share with buyers. Call 702-222-1964 to get started.";

export function GenerateVideo() {
  const [script, setScript] = useState(SAMPLE_SCRIPT);
  const [replicaId, setReplicaId] = useState(DEFAULT_FACE_ID);
  const [video, setVideo] = useState<TavusVideo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!video?.video_id) return;
    if (video.status === "ready" || video.status === "error" || video.status === "deleted") {
      return;
    }

    const timer = window.setInterval(async () => {
      const response = await fetch(`/api/videos/${video.video_id}`);
      const data = (await response.json()) as TavusVideo & { error?: string };
      if (response.ok) {
        setVideo(data);
      }
    }, 4000);

    return () => window.clearInterval(timer);
  }, [video]);

  async function handleGenerate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setVideo(null);

    try {
      const response = await fetch("/api/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          replica_id: replicaId,
          script,
          video_name: "Video Creator listing clip",
        }),
      });
      const data = (await response.json()) as TavusVideo & { error?: string };
      if (!response.ok) {
        throw new Error(data.error || "Failed to generate video");
      }
      setVideo(data);
    } catch (generateError) {
      setError(generateError instanceof Error ? generateError.message : "Failed to generate video");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleGenerate}
      className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
    >
      <h2 className="text-xl font-semibold">Generate a talking-head video</h2>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        Send a script to the Tavus Video API with a face ID. This is async file output, not a live
        CVI room.
      </p>

      <label className="mt-6 block text-sm font-medium">
        Face ID
        <input
          value={replicaId}
          onChange={(event) => setReplicaId(event.target.value)}
          className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          name="replica_id"
        />
      </label>

      <label className="mt-4 block text-sm font-medium">
        Script
        <textarea
          value={script}
          onChange={(event) => setScript(event.target.value)}
          rows={6}
          className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          name="script"
          required
        />
      </label>

      <button
        type="submit"
        disabled={loading || !script.trim()}
        className="mt-6 rounded-md bg-[#6a0dad] px-4 py-2 text-sm font-medium text-white hover:bg-[#5a0b94] disabled:opacity-50"
      >
        {loading ? "Creating..." : "Generate video"}
      </button>

      {error ? (
        <p className="mt-4 text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}

      {video ? (
        <div className="mt-4 rounded-md bg-zinc-50 p-4 text-sm dark:bg-zinc-900" role="status">
          <p>
            <strong>Video ID:</strong> {video.video_id}
          </p>
          <p>
            <strong>Status:</strong> {video.status}
            {video.generation_progress ? ` (${video.generation_progress})` : ""}
          </p>
          {video.hosted_url ? (
            <p className="mt-2">
              <a className="text-[#6a0dad] underline" href={video.hosted_url} target="_blank" rel="noreferrer">
                Open hosted video
              </a>
            </p>
          ) : null}
        </div>
      ) : null}
    </form>
  );
}
