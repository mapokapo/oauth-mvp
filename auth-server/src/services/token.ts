import { signJWT } from "@cross/jwt";

const JWT_SECRET = process.env.JWT_SECRET ?? "secret";

export const issueTokens = async (sub: string, clientId: string) => {
  const accessToken = await signJWT(
    { sub, aud: clientId, scope: "read" },
    JWT_SECRET,
    { expiresIn: "5m" }
  );
  const idToken = await signJWT({ sub, aud: clientId }, JWT_SECRET, {
    expiresIn: "5m",
  });

  return {
    access_token: accessToken,
    token_type: "Bearer",
    expires_in: 300,
    id_token: idToken,
  };
};
