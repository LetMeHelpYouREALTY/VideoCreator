import { NextResponse } from "next/server";
import { errorResponse, getVideo } from "@/lib/tavus";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    if (!id) {
      return NextResponse.json({ error: "Missing video id" }, { status: 400 });
    }
    const video = await getVideo(id);
    return NextResponse.json(video);
  } catch (error) {
    const { body, status } = errorResponse(error);
    return NextResponse.json(body, { status });
  }
}
