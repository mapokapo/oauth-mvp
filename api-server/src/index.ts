import { Hono } from "hono";
import apiRouter from "./routers/apiRouter";
import { cors } from "hono/cors";

const app = new Hono().use(cors()).route("/api", apiRouter);

export default {
  fetch: app.fetch,
  port: process.env.PORT,
};
