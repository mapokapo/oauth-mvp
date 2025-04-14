import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { Hono } from "hono";
import { db } from "../services/db";
import { createUser, type UserWithoutPassword } from "../services/auth";

const authRouter = new Hono().post(
  "/register",
  zValidator(
    "json",
    z.object({
      email: z.string().email(),
      password: z.string().min(6, "Password too short"),
    })
  ),
  async (c) => {
    const { email, password } = c.req.valid("json");

    const statement = db.prepare<UserWithoutPassword, string>(
      `SELECT email FROM users WHERE email = ?`
    );

    const user = statement.get(email);
    if (user) return c.json({ error: "User already exists" }, 400);

    await createUser(email, password);

    return c.json({ message: "User created successfully" }, 201);
  }
);

export default authRouter;
