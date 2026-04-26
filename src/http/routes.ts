import type { FastifyInstance } from "fastify";
import { authenticate } from "./controllers/auth/authenticate";
import { profile } from "./controllers/profile";
import { userRegister } from "./controllers/user/register";
import { verifyJWT } from "./middleware/verify-jwt";

export const appRoutes = async (app: FastifyInstance) => {
  app.post("/users", userRegister);
  app.post("/sessions", authenticate);

  // authenticated
  app.get("/me", { onRequest: [verifyJWT] }, profile);
};
