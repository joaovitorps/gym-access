import type { FastifyInstance } from "fastify";
import { authenticate } from "./controllers/auth/authenticate";
import { userRegister } from "./controllers/user/register";

export const appRoutes = async (app: FastifyInstance) => {
  app.post("/users", userRegister);
  app.post("/sessions", authenticate);
};
