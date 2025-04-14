import { Hono } from "hono";

const apiRouter = new Hono().get("/", (c) => {
  return c.text("Hello world!");
});

export default apiRouter;
