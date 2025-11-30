import { type JWTPayload, jwtVerify, SignJWT } from "jose";
import { env } from "@/env";

export const SECRET_KEY = new TextEncoder().encode(env.AUTH_TOKEN_API_SECRET);

export const AUTH_TOKEN_EXPIRATION_TIME = 2592000; // 30 days

/**
 * Decrypts a token.
 * @param input - The token to decrypt.
 * @returns The decrypted payload.
 */
export function decrypt(input: string) {
  return jwtVerify(input, SECRET_KEY, {
    algorithms: ["HS256"],
  }).then((result) => result.payload);
}

/**
 * Encrypts a payload.
 * @param payload - The payload to encrypt.
 * @param expirationTime - The expiration time in seconds.
 * @returns The encrypted token.
 */
export async function encrypt(
  payload: JWTPayload,
  expirationTime = AUTH_TOKEN_EXPIRATION_TIME,
) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${expirationTime} seconds from now`)
    .sign(SECRET_KEY);
}
