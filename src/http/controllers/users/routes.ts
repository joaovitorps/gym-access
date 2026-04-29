import type { FastifyInstance } from "fastify";
import { verifyJWT } from "@/http/middleware/verify-jwt";
import { authenticate } from "./authenticate";
import { profile } from "./profile";
import { refresh } from "./refresh";
import { userRegister } from "./register";

export const userRoutes = async (app: FastifyInstance) => {
  app.post("/users", userRegister);
  app.post("/sessions", authenticate);

  app.patch("/token/refresh", refresh);

  // authenticated
  app.get("/me", { onRequest: [verifyJWT] }, profile);
};
