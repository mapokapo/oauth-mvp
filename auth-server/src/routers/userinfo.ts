import { Hono } from "hono";
import oauthMiddleware from "../middleware/oauthMiddleware";
import { getUserBySub } from "../services/auth";

const userinfoRouter = new Hono().get("/", oauthMiddleware, (c) => {
  const payload = c.get("jwtPayload");

  const user = getUserBySub(payload.sub as string);
  if (!user) return c.json({ error: "invalid_token" }, 401);

  return c.json({ sub: user.sub, email: user.email });
});

export default userinfoRouter;
