import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { FetchNearbyGyms } from "./fetch-nearby-gyms";

describe("Fetch Nearby Gyms Use Case", async () => {
  let inMemoryGymsRepository: InMemoryGymsRepository;
  let sut: FetchNearbyGyms;

  beforeEach(() => {
    inMemoryGymsRepository = new InMemoryGymsRepository();
    sut = new FetchNearbyGyms(inMemoryGymsRepository);
  });

  it("should be able to search gyms", async () => {
    inMemoryGymsRepository.create({
      title: "Gym near",
      description: "",
      phone: "",
      latitude: -23.521609430320563,
      longitude: -46.671253473511634,
    });

    inMemoryGymsRepository.create({
      title: "Gym far",
      description: "",
      phone: "",
      latitude: -29.1653338,
      longitude: -51.255909,
    });

    const { gyms } = await sut.execute({
      userLatitude: -23.521609430320563,
      userLongitude: -46.671253473511634,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([expect.objectContaining({ title: "Gym near" })]);
  });
});
