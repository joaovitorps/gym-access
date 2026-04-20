import type { FastifyInstance } from "fastify";
import { UserRegister } from "./controllers/user/register";

export const appRoutes = async (app: FastifyInstance) => {
  app.post("/users", UserRegister);
};
