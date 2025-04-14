import { verifyJWT } from "@cross/jwt";

const JWT_SECRET = process.env.JWT_SECRET ?? "secret";

export const verifyAccessToken = async (token: string) => {
  try {
    const payload = await verifyJWT(token, JWT_SECRET);
    return payload;
  } catch {
    return null;
  }
};
