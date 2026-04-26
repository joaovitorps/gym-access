import { hash } from "bcryptjs";
import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { InvalidCredentialsError } from "../errors/invalid-credentials-error";
import { AuthenticateUseCase } from "./authenticate";

let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: AuthenticateUseCase;

describe("Authenticate use case", async () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    sut = new AuthenticateUseCase(inMemoryUsersRepository);
  });

  it("should return InvalidCredentials when wrong user", async () => {
    const wrongAuthData = {
      email: "tes2t@test.com",
      password: "1234567",
    };

    await expect(() => sut.execute(wrongAuthData)).rejects.toBeInstanceOf(
      InvalidCredentialsError,
    );
  });

  it("should return InvalidCredentials when wrong password", async () => {
    inMemoryUsersRepository.create({
      name: "Test",
      email: "test@test.com",
      password_hash: await hash("123456", 6),
    });

    const wrongAuthData = {
      email: "test@test.com",
      password: "1234567",
    };

    await expect(() => sut.execute(wrongAuthData)).rejects.toBeInstanceOf(
      InvalidCredentialsError,
    );
  });

  it("should authenticate user", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "Test",
      email: "test@test.com",
      password_hash: await hash("123456", 6),
    });

    await expect(
      sut.execute({
        email: "test@test.com",
        password: "123456",
      }),
    ).resolves.toEqual({
      user,
    });
  });
});
