import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from "@/app";

describe("Refresh token e2e", async () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to refresh the token", async () => {
    await request(app.server).post("/users").send({
      name: "Doe",
      email: "test@test.com",
      password: "test123",
    });

    const authResponse = await request(app.server).post("/sessions").send({
      email: "test@test.com",
      password: "test123",
    });

    const cookies = authResponse.get("Set-Cookie");

    if (!cookies) {
      throw new Error("No Cookies set");
    }

    const refreshTokenResponse = await request(app.server)
      .patch("/token/refresh")
      .set("Cookie", cookies)
      .expect(200);

    expect(refreshTokenResponse.body).toEqual(
      expect.objectContaining({
        token: expect.any(String),
      }),
    );
    expect(refreshTokenResponse.get("Set-Cookie")).toEqual([
      expect.stringContaining("refreshToken="),
    ]);
  });
});
