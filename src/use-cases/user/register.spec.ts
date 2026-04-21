import { compare } from "bcryptjs";
import * as uuid from "uuid";
import { describe, expect, it } from "vitest";
import { InMemoryRegisterRepository } from "@/repositories/user/in-memory/in-memory-register-repository";
import { UserAlreadyExistsError } from "../errors/user-already-exists-error";
import { UserRegisterUseCase } from "./register";

describe("User Register use case", async () => {
  it("should hash password correctly", async () => {
    const userRegisterUseCase = new UserRegisterUseCase(
      new InMemoryRegisterRepository(),
    );

    const data = {
      name: "Alice Johnson",
      email: "a1lice.2df2123324235johnson@example.com",
      password: "myPlainPassword123",
    };

    const { user } = await userRegisterUseCase.execute(data);

    const isPasswordHashedCorrectly = await compare(
      data.password,
      user.password_hash,
    );

    expect(isPasswordHashedCorrectly).toBe(true);
  });

  it("should fail when user already exists", async () => {
    const userRegisterUseCase = new UserRegisterUseCase(
      new InMemoryRegisterRepository(),
    );

    const data = {
      name: "Alice Johnson",
      email: "a1lice.2df2123324235johnson@example.com",
      password: "myPlainPassword123",
    };

    await userRegisterUseCase.execute(data);

    await expect(() =>
      userRegisterUseCase.execute(data),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });

  it("should create a new user", async () => {
    const userRegisterUseCase = new UserRegisterUseCase(
      new InMemoryRegisterRepository(),
    );

    const data = {
      name: "Alice Johnson",
      email: "a1lice.2df2123324235johnson@example.com",
      password: "myPlainPassword123",
    };

    const { user } = await userRegisterUseCase.execute(data);

    const isValidUuid = uuid.validate(user.id);

    expect(isValidUuid).toBe(true);
  });
});
