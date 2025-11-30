import { type JWTPayload, jwtVerify, SignJWT } from "jose";
import { env } from "@/env";

export const SECRET_KEY = new TextEncoder().encode(env.AUTH_TOKEN_API_SECRET);

export function decrypt(input: string) {
  return jwtVerify(input, SECRET_KEY, {
    algorithms: ["HS256"],
  }).then((result) => result.payload);
}

export async function encrypt(payload: JWTPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("10 days from now")
    .sign(SECRET_KEY);
}
