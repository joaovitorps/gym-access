import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from "@/app";

describe("Register e2e", async () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should get user profile", async () => {
    const userBodyData = {
      name: "Doe",
      email: "test@test.com",
      password: "test123",
    };

    await request(app.server).post("/users").send(userBodyData);
    const authRequest = await request(app.server)
      .post("/sessions")
      .send(userBodyData);

    const { token } = authRequest.body;

    const response = await request(app.server)
      .get("/me")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    const { password: _password, ...profileData } = userBodyData;

    expect(response.body.user).toEqual(expect.objectContaining(profileData));
  });
});
