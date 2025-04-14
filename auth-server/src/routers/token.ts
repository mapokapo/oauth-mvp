import { Hono } from "hono";
import { consumeAuthorizationCode, verifyPKCE } from "../services/oauth";
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
      code_verifier: z.string(),
    })
  ),
  async (c) => {
    const { code, redirect_uri, client_id, code_verifier } =
      c.req.valid("json");

    const data = consumeAuthorizationCode(code);

    if (
      !data ||
      data.clientId !== client_id ||
      data.redirectUri !== redirect_uri
    ) {
      console.log("Invalid code or redirect_uri");
      return c.json({ error: "invalid_grant" }, 400);
    }

    const ok = await verifyPKCE(code_verifier, data.codeChallenge);
    if (!ok) {
      console.log("Invalid code_verifier");
      return c.json({ error: "invalid_grant" }, 400);
    }

    const tokens = await issueTokens(data.sub, client_id);

    return c.json(tokens);
  }
);

export default tokenRouter;
