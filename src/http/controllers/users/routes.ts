import type { FastifyInstance } from "fastify";
import { verifyJWT } from "@/http/middleware/verify-jwt";
import { authenticate } from "./authenticate";
import { profile } from "./profile";
import { userRegister } from "./register";

export const userRoutes = async (app: FastifyInstance) => {
  app.post("/users", userRegister);
  app.post("/sessions", authenticate);

  // authenticated
  app.get("/me", { onRequest: [verifyJWT] }, profile);
};
