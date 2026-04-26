import type { User } from "@/generated/prisma/client";
import type { UsersRepository } from "@/repositories/users-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface getUserProfileParams {
  userId: string;
}

interface getUserProfileUseCaseReturn {
  user: User;
}

export class GetUserProfileUseCase {
  constructor(private userRegisterRepository: UsersRepository) {}

  async execute({
    userId,
  }: getUserProfileParams): Promise<getUserProfileUseCaseReturn> {
    const user = await this.userRegisterRepository.existsById(userId);

    if (!user) {
      throw new ResourceNotFoundError();
    }

    return { user };
  }
}
