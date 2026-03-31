import { jwtVerify, createRemoteJWKSet } from "jose";

const JWKS = createRemoteJWKSet(
  new URL("https://localhost:3000/api/auth/jwks"),
);

export async function VerifyInternalJwt(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWKS);
    return payload;
  } catch (error) {
    throw new Error("[Internal JWT] Invalid token: " + error);
  }
}
