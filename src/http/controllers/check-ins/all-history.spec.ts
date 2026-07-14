import { hash } from "bcryptjs";
import request from "supertest";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { app } from "@/app";
import { prisma } from "@/lib/prisma";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe("Check-in All History e2e", async () => {
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

  it("should return all check-ins with gym data for admins", async () => {
    const { token: adminToken } = await createAndAuthenticateUser(app, true);

    const memberUser = await prisma.user.create({
      data: {
        name: "Member",
        email: "member@test.com",
        password_hash: await hash("test123", 6),
        role: "MEMBER",
      },
    });

    const gym = await prisma.gym.create({
      data: {
        title: "JS Gym",
        description: "",
        phone: "",
        latitude: -23.5229811,
        longitude: -46.6734008,
      },
    });

    await prisma.checkIn.create({
      data: {
        gym_id: gym.id,
        user_id: memberUser.id,
      },
    });

    const response = await request(app.server)
      .get("/check-ins")
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(200);

    expect(response.body.checkIns).toHaveLength(1);
    expect(response.body.checkIns[0]).toMatchObject({
      gym_id: gym.id,
      user_id: memberUser.id,
      gym: { id: gym.id, title: "JS Gym" },
      validated_at: null,
    });
  });

  it("should not allow members to access the admin endpoint", async () => {
    const { token } = await createAndAuthenticateUser(app);

    const response = await request(app.server)
      .get("/check-ins")
      .set("Authorization", `Bearer ${token}`)
      .expect(401);

    expect(response.body.message).toBe("Unauthorized.");
  });
});
