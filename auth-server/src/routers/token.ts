import { Hono } from "hono";
import { consumeAuthorizationCode } from "../services/oauth";
import { issueTokens } from "../services/token";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

const tokenRouter = new Hono().post(
  "/",
  zValidator(
    "json",
    z.object({
      grant_type: z.enum(["authorization_code"]),
      code: z.string(),
      redirect_uri: z.string().url(),
      client_id: z.string(),
    })
  ),
  async (c) => {
    const { code, redirect_uri, client_id } = c.req.valid("json");

    const data = consumeAuthorizationCode(code);

    if (
      !data ||
      data.clientId !== client_id ||
      data.redirectUri !== redirect_uri
    ) {
      console.log("Invalid authorization code");
      return c.json({ error: "invalid_grant" }, 400);
    }

    const tokens = await issueTokens(data.sub, client_id);

    return c.json(tokens);
  }
);

export default tokenRouter;
