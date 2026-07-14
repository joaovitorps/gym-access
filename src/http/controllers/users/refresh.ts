import type { FastifyReply, FastifyRequest } from "fastify";
import { env } from "@/env";

export const refresh = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    await request.jwtVerify({ onlyCookie: true });

    const { role } = request.user;

    const authToken = await reply.jwtSign(
      { role },
      {
        sign: { sub: request.user.sub },
      },
    );

    const refreshToken = await reply.jwtSign(
      { role },
      {
        sign: { sub: request.user.sub, expiresIn: "7d" },
      },
    );

    return reply
      .setCookie("refreshToken", refreshToken, {
        path: "/",
        httpOnly: true,
        sameSite: env.NODE_ENV === "production" ? "none" : "lax", // alternative CSRF protection
        secure: env.NODE_ENV === "production", // send cookie over HTTPS only
      })
      .code(200)
      .send({ token: authToken });
  } catch (_error) {
    return reply.code(401).send({ message: "Unauthorized." });
  }
};
