import "server-only";
import { SignJWT } from "jose";

const TOKEN_TTL_SECONDS = 60 * 10;

export async function mintConnectionToken(userId: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000);

  return new SignJWT({})
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setSubject(userId)
    .setIssuedAt(now)
    .setExpirationTime(now + TOKEN_TTL_SECONDS)
    .sign(getSecret());
}

// Scopes the token to one `jobs:{id}` channel so a browser only reaches jobs it owns.
export async function mintSubscriptionToken(
  userId: string,
  channel: string,
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);

  return new SignJWT({ channel })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setSubject(userId)
    .setIssuedAt(now)
    .setExpirationTime(now + TOKEN_TTL_SECONDS)
    .sign(getSecret());
}

function getSecret(): Uint8Array {
  const secret = process.env.CENTRIFUGO_CLIENT_TOKEN_HMAC_SECRET_KEY;

  if (!secret) {
    throw new Error("CENTRIFUGO_CLIENT_TOKEN_HMAC_SECRET_KEY is not set");
  }

  return new TextEncoder().encode(secret);
}
