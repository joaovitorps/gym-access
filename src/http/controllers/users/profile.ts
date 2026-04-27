import type { FastifyReply, FastifyRequest } from "fastify";
import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error";
import { makeGetUserProfileUseCase } from "@/use-cases/factories/make-get-user-profile-use-case";

export const profile = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const getUserProfileUseCase = makeGetUserProfileUseCase();

    const userId = request.user.sub;

    const { user } = await getUserProfileUseCase.execute({ userId });

    const { password_hash, ...userReturnData } = user;

    return reply.code(200).send({ user: userReturnData });
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.code(400).send({ message: error.message });
    }
  }
};
