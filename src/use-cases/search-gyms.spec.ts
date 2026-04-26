import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { SearchGymsUseCase } from "./search-gyms";

describe("Search Gyms Use Case", async () => {
  let inMemoryGymsRepository: InMemoryGymsRepository;
  let sut: SearchGymsUseCase;

  beforeEach(() => {
    inMemoryGymsRepository = new InMemoryGymsRepository();
    sut = new SearchGymsUseCase(inMemoryGymsRepository);
  });

  it("should be able to search gyms", async () => {
    const gymDefaultData = {
      description: "",
      phone: "",
      latitude: -23.521609430320563,
      longitude: -46.671253473511634,
    };

    inMemoryGymsRepository.create({
      title: "Javascript Gym",
      ...gymDefaultData,
    });

    inMemoryGymsRepository.create({
      title: "Typescript Gym",
      ...gymDefaultData,
    });

    const { gyms } = await sut.execute({
      query: "Typescript",
      page: 1,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([
      expect.objectContaining({ title: "Typescript Gym" }),
    ]);
  });

  it("should be able to search only 20 gyms per page", async () => {
    for (let i = 0; i < 22; i++) {
      inMemoryGymsRepository.create({
        title: `Gym ${i}`,
        description: "",
        phone: "",
        latitude: -23.521609430320563,
        longitude: -46.671253473511634,
      });
    }

    const { gyms } = await sut.execute({
      query: "Gym",
      page: 2,
    });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({ title: "Gym 20" }),
      expect.objectContaining({ title: "Gym 21" }),
    ]);
  });
});
