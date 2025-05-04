import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono().use(cors()).get("/:token", async (c) => {
  const accessToken = c.req.param("token");

  const userData = await fetch("http://localhost:5001/userinfo", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((res) => res.json())
    .catch((err) => {
      console.error("Error fetching user info:", err);
      return c.json({ error: "Failed to fetch user info" }, 500);
    });

  console.log("User access token:", accessToken);
  console.log("User data:", userData);

  const privateData = await fetch("http://localhost:5000/api/private", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((res) => res.text())
    .catch((err) => {
      console.error("Error fetching private data:", err);
      return c.json({ error: "Failed to fetch private data" }, 500);
    });
  console.log("Private data:", privateData);

  return c.body(null);
});

export default {
  fetch: app.fetch,
  port: process.env.PORT,
};
