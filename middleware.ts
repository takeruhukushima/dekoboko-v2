import { getSessionAgent } from "@/lib/auth/session";
import { Agent } from "@atproto/api";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const agent: Agent | null = await getSessionAgent();

  if (!agent) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return response;
}
