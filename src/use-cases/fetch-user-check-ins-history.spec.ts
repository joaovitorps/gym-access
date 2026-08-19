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
      inMemoryCheckInsRepository.checkIns[1],
      inMemoryCheckInsRepository.checkIns[0],
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

  it("should return check-ins history sorted newest-first by created_at", async () => {
    const oldest = new Date("2026-01-01T10:00:00Z");
    const middle = new Date("2026-01-02T10:00:00Z");
    const newest = new Date("2026-01-03T10:00:00Z");

    inMemoryCheckInsRepository.checkIns.push(
      {
        id: "check-in-1",
        gym_id: "gym-old",
        user_id: "user-1",
        validated_at: null,
        created_at: oldest,
      },
      {
        id: "check-in-2",
        gym_id: "gym-new",
        user_id: "user-1",
        validated_at: null,
        created_at: newest,
      },
      {
        id: "check-in-3",
        gym_id: "gym-mid",
        user_id: "user-1",
        validated_at: null,
        created_at: middle,
      },
    );

    const { checkIns } = await sut.execute({
      userId: "user-1",
      page: 1,
    });

    expect(checkIns).toHaveLength(3);
    expect(checkIns[0].gym_id).toBe("gym-new");
    expect(checkIns[1].gym_id).toBe("gym-mid");
    expect(checkIns[2].gym_id).toBe("gym-old");
  });
});
