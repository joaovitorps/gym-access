import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from "@/app";

describe("User Authenticate e2e", async () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should authenticate the user", async () => {
    await request(app.server).post("/users").send({
      name: "Doe",
      email: "test@test.com",
      password: "test123",
    });

    const response = await request(app.server)
      .post("/sessions")
      .send({
        email: "test@test.com",
        password: "test123",
      })
      .expect(200);

    expect(response.body.token).toEqual(expect.any(String));
  });
});
