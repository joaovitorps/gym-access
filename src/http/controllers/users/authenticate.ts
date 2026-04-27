import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { InvalidCredentialsError } from "@/use-cases/errors/invalid-credentials-error";
import { makeAuthenticateUseCase } from "@/use-cases/factories/make-authenticate-use-case";

export const authenticate = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const checkBodySchema = z.object({
    email: z.email(),
    password: z.string().min(6),
  });

  const { email, password } = checkBodySchema.parse(request.body);

  try {
    const authenticateUseCase = makeAuthenticateUseCase();

    const { user } = await authenticateUseCase.execute({ email, password });

    const authToken = await reply.jwtSign(
      {},
      {
        sign: { sub: user.id },
      },
    );

    return reply.code(200).send({ token: authToken });
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.code(400).send({ message: error.message });
    }

    throw error;
  }
};
