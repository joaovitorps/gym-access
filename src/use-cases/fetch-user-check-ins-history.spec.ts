import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { FetchUserCheckInsHistoryUseCase } from "./fetch-user-check-ins-history";

describe("Fetch User Check-ins History Use Case", async () => {
  let inMemoryCheckInsRepository: InMemoryCheckInsRepository;
  let sut: FetchUserCheckInsHistoryUseCase;

  beforeEach(() => {
    inMemoryCheckInsRepository = new InMemoryCheckInsRepository();
    sut = new FetchUserCheckInsHistoryUseCase(inMemoryCheckInsRepository);
  });

  it("should be able to fetch the user check-ins history", async () => {
    inMemoryCheckInsRepository.create({
      gym_id: "gym-1",
      user_id: "user-1",
    });

    inMemoryCheckInsRepository.create({
      gym_id: "gym-2",
      user_id: "user-1",
    });

    const { checkIns } = await sut.execute({
      userId: "user-1",
      page: 1,
    });

    expect(checkIns).toHaveLength(2);
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: "gym-1" }),
      expect.objectContaining({ gym_id: "gym-2" }),
    ]);
  });

  it("should be able to fetch only 20 user check-ins history per page", async () => {
    for (let i = 0; i < 22; i++) {
      inMemoryCheckInsRepository.create({
        gym_id: `gym-${i}`,
        user_id: "user-1",
      });
    }

    const { checkIns } = await sut.execute({
      userId: "user-1",
      page: 2,
    });

    expect(checkIns).toHaveLength(2);
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: "gym-20" }),
      expect.objectContaining({ gym_id: "gym-21" }),
    ]);
  });
});
