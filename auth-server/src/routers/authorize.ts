import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { Hono } from "hono";
import { verifyUser } from "../services/auth";
import { generateAuthorizationCode } from "../services/oauth";
import { serveStatic } from "hono/bun";

const authorizeRouter = new Hono()
  .get(
    "/",
    zValidator(
      "query",
      z.object({
        client_id: z.string(),
        redirect_uri: z.string().url(),
        response_type: z.enum(["code", "token"]),
        scope: z.string(),
        state: z.string(),
      })
    ),
    serveStatic({
      root: "./public",
      path: "login.html",
    })
  )
  .post(
    "/",
    zValidator(
      "form",
      z.object({
        email: z.string().email(),
        password: z.string(),
        response_type: z.enum(["code", "token"]),
        client_id: z.string(),
        redirect_uri: z.string().url(),
        scope: z.string(),
        state: z.string().optional(),
      })
    ),
    async (c) => {
      const {
        email,
        password,
        response_type,
        client_id,
        redirect_uri,
        scope,
        state,
      } = c.req.valid("form");

      const user = await verifyUser(email, password);
      if (!user) {
        return c.text("Invalid credentials", 401);
      }

      const code = generateAuthorizationCode({
        clientId: client_id,
        redirectUri: redirect_uri,
        sub: user.sub,
      });

      // Redirect back to client with code & state
      const redirectUrl = new URL(redirect_uri);
      redirectUrl.searchParams.set("scope", scope);
      redirectUrl.searchParams.set("code", code);

      if (state) redirectUrl.searchParams.set("state", state);
      if (response_type === "token") {
        redirectUrl.searchParams.set("response_type", "token");
      }

      return c.redirect(redirectUrl.toString());
    }
  );

export default authorizeRouter;
