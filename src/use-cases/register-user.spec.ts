import { compare } from "bcryptjs";
import * as uuid from "uuid";
import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";
import { RegisterUserUseCase } from "./register-user";

let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: RegisterUserUseCase;

describe("User Register use case", async () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    sut = new RegisterUserUseCase(inMemoryUsersRepository);
  });

  it("should hash password correctly", async () => {
    const data = {
      name: "Alice Johnson",
      email: "a1lice.2df2123324235johnson@example.com",
      password: "myPlainPassword123",
    };

    const { user } = await sut.execute(data);

    const isPasswordHashedCorrectly = await compare(
      data.password,
      user.password_hash,
    );

    expect(isPasswordHashedCorrectly).toBe(true);
  });

  it("should fail when user already exists", async () => {
    const data = {
      name: "Alice Johnson",
      email: "a1lice.2df2123324235johnson@example.com",
      password: "myPlainPassword123",
    };

    await sut.execute(data);

    await expect(() => sut.execute(data)).rejects.toBeInstanceOf(
      UserAlreadyExistsError,
    );
  });

  it("should create a new user", async () => {
    const data = {
      name: "Alice Johnson",
      email: "a1lice.2df2123324235johnson@example.com",
      password: "myPlainPassword123",
    };

    const { user } = await sut.execute(data);

    const isValidUuid = uuid.validate(user.id);

    expect(isValidUuid).toBe(true);
  });
});
