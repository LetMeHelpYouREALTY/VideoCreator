import { NextResponse } from "next/server";
import { createConversation, errorResponse } from "@/lib/tavus";
import type { CreateConversationInput } from "@/types/tavus";

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as CreateConversationInput;
    const conversation = await createConversation(body);
    return NextResponse.json(conversation);
  } catch (error) {
    const { body, status } = errorResponse(error);
    return NextResponse.json(body, { status });
  }
}
