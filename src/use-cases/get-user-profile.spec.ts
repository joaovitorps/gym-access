import { hash } from "bcryptjs";
import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { GetUserProfileUseCase } from "./get-user-profile";

let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: GetUserProfileUseCase;

describe("Get user profile use case", async () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    sut = new GetUserProfileUseCase(inMemoryUsersRepository);
  });

  it("should return user profile info", async () => {
    const createdUser = await inMemoryUsersRepository.create({
      name: "Alice Johnson",
      email: "a1lice.2df2123324235johnson@example.com",
      password_hash: await hash("myPlainPassword123", 6),
    });

    const { user } = await sut.execute({ userId: createdUser.id });

    expect(user).toEqual(
      expect.objectContaining({
        name: "Alice Johnson",
        email: "a1lice.2df2123324235johnson@example.com",
      }),
    );
  });

  it("should return resource not found error", async () => {
    await expect(() =>
      sut.execute({ userId: "non-valid-id" }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
