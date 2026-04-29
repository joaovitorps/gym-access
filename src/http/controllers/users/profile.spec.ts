import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe("User Profile e2e", async () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should get user profile", async () => {
    const { token, userBodyData } = await createAndAuthenticateUser(app);

    const response = await request(app.server)
      .get("/me")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    const { password: _password, ...profileData } = userBodyData;

    expect(response.body.user).toEqual(expect.objectContaining(profileData));
  });
});
