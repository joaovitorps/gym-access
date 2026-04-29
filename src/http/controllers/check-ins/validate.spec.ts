import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from "@/app";
import { prisma } from "@/lib/prisma";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe("Validate Check-in e2e", async () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to validate a check-in", async () => {
    const { token } = await createAndAuthenticateUser(app, true);
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

    const { id } = await prisma.checkIn.create({
      data: {
        gym_id: gym.id,
        user_id: user.id,
      },
    });

    const checkInBeforeValidate = await prisma.checkIn.findUniqueOrThrow({
      where: { id },
    });

    expect(checkInBeforeValidate.validated_at).toBe(null);

    await request(app.server)
      .patch(`/check-ins/${id}/validate`)
      .set("Authorization", `Bearer ${token}`)
      .expect(204);

    const checkInAfterValidate = await prisma.checkIn.findUniqueOrThrow({
      where: { id },
    });

    expect(checkInAfterValidate.validated_at).toEqual(expect.any(Date));
  });
});
