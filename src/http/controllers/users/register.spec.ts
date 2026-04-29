import request from "supertest";
import { afterAll, beforeAll, describe, it } from "vitest";
import { app } from "@/app";

describe("User Register e2e", async () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should register the user", async () => {
    await request(app.server)
      .post("/users")
      .send({
        name: "Doe",
        email: "test@test.com",
        password: "test123",
      })
      .expect(201);
  });
});
