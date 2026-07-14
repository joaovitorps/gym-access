import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from "@/app";
import { prisma } from "@/lib/prisma";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe("Check-in History e2e", async () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to get the user check-in history with gym data", async () => {
    const { token } = await createAndAuthenticateUser(app);

    const user = await prisma.user.findFirstOrThrow();

    const gym = await prisma.gym.create({
      data: {
        title: "JS Gym",
        description: "",
        phone: "",
        latitude: -23.5229811,
        longitude: -46.6734008,
      },
    });

    await prisma.checkIn.createManyAndReturn({
      data: [
        { gym_id: gym.id, user_id: user.id },
        { gym_id: gym.id, user_id: user.id },
      ],
    });

    const checkInHistoryRequest = await request(app.server)
      .get("/check-ins/history")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(checkInHistoryRequest.body.checkIns).toHaveLength(2);
    expect(checkInHistoryRequest.body.checkIns).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          gym_id: gym.id,
          user_id: user.id,
          gym: expect.objectContaining({ id: gym.id, title: "JS Gym" }),
        }),
      ]),
    );
  });
});
