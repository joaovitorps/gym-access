import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { PrismaRegisterRepository } from "@/repositories/user/prisma/prisma-register-repository";
import { UserAlreadyExistsError } from "@/use-cases/errors/user-already-exists-error";
import { UserRegisterUseCase } from "@/use-cases/user/register";

export const UserRegister = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const checkBodySchema = z.object({
    name: z.string().min(3),
    email: z.email(),
    password: z.string().min(6),
  });

  const { name, email, password } = checkBodySchema.parse(request.body);

  try {
    const userRegisterUseCase = new UserRegisterUseCase(
      new PrismaRegisterRepository(),
    );

    await userRegisterUseCase.execute({ name, email, password });
  } catch (error) {
    if (error instanceof UserAlreadyExistsError) {
      return reply.code(409).send({ message: error.message });
    }

    throw error;
  }

  return reply.code(201).send();
};
