import { Hono } from "hono";
import authorizeRouter from "./routers/authorize";
import tokenRouter from "./routers/token";
import userinfoRouter from "./routers/userinfo";
import { cors } from "hono/cors";
import authRouter from "./routers/auth";

const app = new Hono()
  .use(cors())
  .route("/authorize", authorizeRouter)
  .route("/token", tokenRouter)
  .route("/userinfo", userinfoRouter)
  .route("/auth", authRouter);

export default {
  fetch: app.fetch,
  port: process.env.PORT,
};
