import { hash } from "bcryptjs";
import type { FastifyInstance } from "fastify";
import request from "supertest";
import { prisma } from "@/lib/prisma";

export const createAndAuthenticateUser = async (
  app: FastifyInstance,
  isAdmin = false,
) => {
  const userBodyData = {
    name: "Doe",
    email: "test@test.com",
    password: "test123",
  };

  await prisma.user.create({
    data: {
      name: userBodyData.name,
      email: userBodyData.email,
      password_hash: await hash(userBodyData.password, 6),
      role: isAdmin ? "ADMIN" : "MEMBER",
    },
  });

  const authRequest = await request(app.server)
    .post("/sessions")
    .send(userBodyData);

  const { token } = authRequest.body;

  return { token, userBodyData };
};
