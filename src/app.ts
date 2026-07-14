import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import { fastify } from "fastify";
import * as z from "zod";
import { env } from "./env";
import { checkInRoutes } from "./http/controllers/check-ins/routes";
import { gymRoutes } from "./http/controllers/gyms/routes";
import { userRoutes } from "./http/controllers/users/routes";

export const app = fastify({
  logger: true,
});

app.register(cors, {
  origin: env.WEB_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"],
});

app.register(jwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: "refreshToken",
    signed: false,
  },
  sign: {
    expiresIn: "10m",
  },
});

app.register(cookie);

app.register(userRoutes);
app.register(gymRoutes);
app.register(checkInRoutes);

app.setErrorHandler((error, _request, reply) => {
  if (error instanceof z.ZodError) {
    return reply
      .code(400)
      .send({ message: "Validation Error", issues: z.treeifyError(error) });
  }

  if (env.NODE_ENV !== "production") {
    console.error(error);
  } else {
    // TODO: use sentry/datadog/graphana or any other log external tool
  }

  return reply.code(500).send({ message: "Internal Server Error" });
});
