import { randomUUID } from "node:crypto";
import request from "supertest";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { app } from "@/app";
import { prisma } from "@/lib/prisma";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe("Check-in Error Statuses e2e", async () => {
  beforeAll(async () => {
    await app.ready();
  });

  beforeEach(async () => {
    await prisma.checkIn.deleteMany();
    await prisma.gym.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should return 409 when checking in twice on the same day", async () => {
    const { token } = await createAndAuthenticateUser(app);

    const { id } = await prisma.gym.create({
      data: {
        title: "JS Gym",
        description: "",
        phone: "",
        latitude: -23.5229811,
        longitude: -46.6734008,
      },
    });

    const checkInData = {
      latitude: -23.5229811,
      longitude: -46.6734008,
    };

    await request(app.server)
      .post(`/gyms/${id}/check-ins`)
      .set("Authorization", `Bearer ${token}`)
      .send(checkInData)
      .expect(201);

    const secondResponse = await request(app.server)
      .post(`/gyms/${id}/check-ins`)
      .set("Authorization", `Bearer ${token}`)
      .send(checkInData)
      .expect(409);

    expect(secondResponse.body.message).toBe("Max number check-in reached.");
  });

  it("should return 422 when checking in from beyond the max distance", async () => {
    const { token } = await createAndAuthenticateUser(app);

    const { id } = await prisma.gym.create({
      data: {
        title: "Far Gym",
        description: "",
        phone: "",
        latitude: -23.5229811,
        longitude: -46.6734008,
      },
    });

    const response = await request(app.server)
      .post(`/gyms/${id}/check-ins`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        latitude: -22.0,
        longitude: -45.0,
      })
      .expect(422);

    expect(typeof response.body.message).toBe("string");
    expect(response.body.message.length).toBeGreaterThan(0);
  });

  it("should return 404 when checking in to a non-existent gym", async () => {
    const { token } = await createAndAuthenticateUser(app);

    const response = await request(app.server)
      .post(`/gyms/${randomUUID()}/check-ins`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        latitude: -23.5229811,
        longitude: -46.6734008,
      })
      .expect(404);

    expect(typeof response.body.message).toBe("string");
    expect(response.body.message.length).toBeGreaterThan(0);
  });
});
