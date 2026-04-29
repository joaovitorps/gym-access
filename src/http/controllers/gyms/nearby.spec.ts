import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe("Nearby Gym e2e", async () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to search for nearby gyms", async () => {
    const { token } = await createAndAuthenticateUser(app, true);

    const gymData = {
      title: "JS Gym",
      description: "",
      phone: "",
      latitude: -23.521609430320563,
      longitude: -46.671253473511634,
    };

    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send(gymData);

    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Gym far",
        description: "",
        phone: "",
        latitude: -29.1653338,
        longitude: -51.255909,
      });

    const gymSearchResponse = await request(app.server)
      .get("/gyms/nearby")
      .set("Authorization", `Bearer ${token}`)
      .query({ latitude: gymData.latitude, longitude: gymData.longitude })
      .expect(200);

    expect(gymSearchResponse.body.gyms).toHaveLength(1);
    expect(gymSearchResponse.body.gyms).toEqual([
      expect.objectContaining({ title: gymData.title }),
    ]);
  });
});
