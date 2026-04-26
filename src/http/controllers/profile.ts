import type { FastifyReply, FastifyRequest } from "fastify";

export const profile = async (request: FastifyRequest, reply: FastifyReply) => {
  await request.jwtVerify();

  console.log(request.user.sub);

  reply.code(200).send();
};
