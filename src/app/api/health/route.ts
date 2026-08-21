import { NextResponse } from "next/server";
import { getTavusApiKey } from "@/lib/tavus";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "videocreator",
    tavusConfigured: Boolean(getTavusApiKey()),
  });
}
