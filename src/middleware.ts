import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const encoder = new TextEncoder();

function toHex(buf: ArrayBuffer) {
  return [...new Uint8Array(buf)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// constant-time string compare (timing-safe style)
function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

async function hmacSha256Hex(secret: string, message: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(message));
  return toHex(sig);
}

async function isValidToken(token?: string) {
  if (!token) return false;

  // Must match the same secret used in src/lib/auth.ts and the login
  // action (src/app/admin/actions.ts) — do not fall back to
  // ADMIN_PASSWORD here, or a session token created with one secret
  // could fail verification against another.
  const secret = process.env.ADMIN_SESSION_SECRET || "";
  if (!secret) return false;

  // same logic as your old code: HMAC(secret, "authenticated").hex
  const expected = await hmacSha256Hex(secret, "authenticated");

  return safeEqual(token, expected);
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (path.startsWith("/admin") && path !== "/admin/login") {
    const session = request.cookies.get("admin_session")?.value;

    if (!session || !(await isValidToken(session))) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};