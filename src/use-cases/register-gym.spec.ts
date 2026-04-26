import * as uuid from "uuid";
import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { RegisterGymUseCase } from "./register-gym";

let inMemoryGymsRepository: InMemoryGymsRepository;
let sut: RegisterGymUseCase;

describe("Register Gym use case", async () => {
  beforeEach(() => {
    inMemoryGymsRepository = new InMemoryGymsRepository();
    sut = new RegisterGymUseCase(inMemoryGymsRepository);
  });

  it("should be able to register a gym", async () => {
    const gymData = {
      title: "JS Gym",
      description: "",
      phone: "",
      latitude: -23.521609430320563,
      longitude: -46.671253473511634,
    };

    const { gym } = await sut.execute(gymData);

    const validUUID = uuid.validate(gym.id);

    expect(validUUID).toBe(true);
  });
});
