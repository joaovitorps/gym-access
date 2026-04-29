import type { FastifyInstance } from "fastify";
import { verifyJWT } from "@/http/middleware/verify-jwt";
import { verifyRole } from "@/http/middleware/verify-role";
import { gymNearby } from "./nearby";
import { gymRegister } from "./register";
import { gymSearch } from "./search";

export const gymRoutes = async (app: FastifyInstance) => {
  app.addHook("onRequest", verifyJWT);

  app.post("/gyms", { onRequest: [verifyRole("ADMIN")] }, gymRegister);
  app.get("/gyms/search", gymSearch);
  app.get("/gyms/nearby", gymNearby);
};
