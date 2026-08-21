import { NextResponse } from "next/server";
import { endConversation, errorResponse } from "@/lib/tavus";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    if (!id) {
      return NextResponse.json({ error: "Missing conversation id" }, { status: 400 });
    }
    await endConversation(id);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    const { body, status } = errorResponse(error);
    return NextResponse.json(body, { status });
  }
}
