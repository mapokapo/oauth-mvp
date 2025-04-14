import { Hono } from "hono";
import apiRouter from "./routers/apiRouter";

const app = new Hono().route("/api", apiRouter);

export default {
  fetch: app.fetch,
  port: process.env.PORT,
};
