import { NextResponse } from "next/server";
import { createVideo, errorResponse } from "@/lib/tavus";
import { DEFAULT_FACE_ID } from "@/lib/constants";
import type { CreateVideoInput } from "@/types/tavus";

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as Partial<CreateVideoInput>;
    const replicaId = body.replica_id?.trim() || DEFAULT_FACE_ID;
    const script = body.script?.trim();

    if (!script) {
      return NextResponse.json({ error: "A script is required" }, { status: 400 });
    }

    const video = await createVideo({
      replica_id: replicaId,
      script,
      video_name: body.video_name,
    });
    return NextResponse.json(video);
  } catch (error) {
    const { body, status } = errorResponse(error);
    return NextResponse.json(body, { status });
  }
}
