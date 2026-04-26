import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { FetchUserMetricsUseCase } from "./fetch-user-metrics";

describe("Fetch User Metrics Use Case", async () => {
  let inMemoryCheckInsRepository: InMemoryCheckInsRepository;
  let sut: FetchUserMetricsUseCase;

  beforeEach(() => {
    inMemoryCheckInsRepository = new InMemoryCheckInsRepository();
    sut = new FetchUserMetricsUseCase(inMemoryCheckInsRepository);
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

    const { userTotalOfCheckIns } = await sut.execute({
      userId: "user-1",
    });

    expect(userTotalOfCheckIns).toEqual(2);
  });
});
