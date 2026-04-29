import request from "supertest";
import { afterAll, beforeAll, describe, it } from "vitest";
import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe("Register Gym e2e", async () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to register a gym", async () => {
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
      .send(gymData)
      .expect(201);
  });
});
