import { Hono } from "hono";
import oauthMiddleware from "../middleware/oauthMiddleware";

const apiRouter = new Hono()
  .get("/private", oauthMiddleware, (c) => {
    const jwtPayload = c.get("jwtPayload");

    return c.text(`Hello user with ID ${jwtPayload.sub}`);
  })
  .get("public", (c) => {
    return c.text("Hello unknown user");
  });

export default apiRouter;
