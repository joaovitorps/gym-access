import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { CheckInUseCase } from "./check-in";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

let inMemoryCheckInsRepository: InMemoryCheckInsRepository;
let inMemoryGymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;

describe("Check-in use case", async () => {
  beforeEach(() => {
    inMemoryCheckInsRepository = new InMemoryCheckInsRepository();
    inMemoryGymsRepository = new InMemoryGymsRepository();
    sut = new CheckInUseCase(
      inMemoryCheckInsRepository,
      inMemoryGymsRepository,
    );

    vi.useFakeTimers();

    inMemoryGymsRepository.create({
      id: "",
      title: "JS Gym",
      description: "",
      phone: "",
      latitude: -23.521609430320563,
      longitude: -46.671253473511634,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const userSample = {
    gymId: "gym-0",
    userId: "user-0",
    userLatitude: -23.521914388523783,
    userLongitude: -46.67177918644534,
  };

  it("should check the user in", async () => {
    const { checkIn } = await sut.execute(userSample);

    expect(checkIn).not.toBe([]);
  });

  it("should fail on check-in", async () => {
    await expect(() =>
      sut.execute({
        gymId: "",
        userId: "",
        userLatitude: -23.5229811,
        userLongitude: -46.6734008,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should return all user check ins", async () => {});

  it("should not be able to check in twice on the same day", async () => {
    vi.setSystemTime(new Date(2026, 1, 1, 0, 0, 0, 0));

    await sut.execute(userSample);

    await expect(() => sut.execute(userSample)).rejects.toBeInstanceOf(Error);
  });

  it("should be able to check in twice on different days", async () => {
    vi.setSystemTime(new Date(2026, 1, 1, 0, 0, 0, 0));
    await sut.execute(userSample);

    vi.setSystemTime(new Date(2026, 1, 2, 0, 0, 0, 0));

    await expect(sut.execute(userSample)).resolves.toBeTruthy();
  });

  it("should not be able to check in on a distant gym", async () => {
    await expect(() =>
      sut.execute({
        gymId: "gym-0",
        userId: "user-0",
        userLatitude: -23.5229811,
        userLongitude: -46.6734008,
      }),
    ).rejects.instanceOf(Error);
  });
});
