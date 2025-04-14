import { verifyJWT, type JWTPayload } from "@cross/jwt";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";

type Env = {
  Variables: {
    jwtPayload: JWTPayload;
  };
};

const oauthMiddleware = createMiddleware<Env>(async (c, next) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader) {
    throw new HTTPException(401, {
      message: "Unauthorized",
    });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    throw new HTTPException(401, {
      message: "Unauthorized",
    });
  }

  try {
    const decoded = await verifyJWT(token, process.env.JWT_SECRET ?? "secret");

    c.set("jwtPayload", decoded);
    return next();
  } catch (err) {
    throw new HTTPException(401, {
      message: "Unauthorized",
    });
  }
});

export default oauthMiddleware;
