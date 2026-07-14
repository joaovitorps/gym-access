import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { FetchAllCheckInsHistoryUseCase } from "./fetch-all-check-ins-history";

let checkInsRepository: InMemoryCheckInsRepository;
let sut: FetchAllCheckInsHistoryUseCase;

describe("Fetch All Check-ins History Use Case", () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new FetchAllCheckInsHistoryUseCase(checkInsRepository);
  });

  it("should be able to fetch all check-ins history", async () => {
    await checkInsRepository.create({
      gym_id: "gym-01",
      user_id: "user-01",
    });

    await checkInsRepository.create({
      gym_id: "gym-02",
      user_id: "user-02",
    });

    const { checkIns } = await sut.execute({
      page: 1,
    });

    expect(checkIns).toHaveLength(2);
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: "gym-01", user_id: "user-01" }),
      expect.objectContaining({ gym_id: "gym-02", user_id: "user-02" }),
    ]);
  });

  it("should be able to fetch paginated check-ins history", async () => {
    for (let i = 1; i <= 22; i++) {
      await checkInsRepository.create({
        gym_id: `gym-${i}`,
        user_id: "user-01",
      });
    }

    const { checkIns } = await sut.execute({
      page: 2,
    });

    expect(checkIns).toHaveLength(2);
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: "gym-21" }),
      expect.objectContaining({ gym_id: "gym-22" }),
    ]);
  });
});
