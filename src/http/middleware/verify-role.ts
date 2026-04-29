import type { FastifyReply, FastifyRequest } from "fastify";
import type { Roles } from "@/generated/prisma/enums";

export const verifyRole = (roleToVerify: Roles) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const { role } = request.user;

    if (role !== roleToVerify) {
      return reply.status(401).send({ message: "Unauthorized." });
    }
  };
};
