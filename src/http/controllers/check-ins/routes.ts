import type { FastifyInstance } from "fastify";
import { verifyJWT } from "@/http/middleware/verify-jwt";
import { verifyRole } from "@/http/middleware/verify-role";
import { checkInAllHistory } from "./all-history";
import { checkInHistory } from "./history";
import { checkInMetrics } from "./metrics";
import { checkInRegister } from "./register";
import { checkInValidate } from "./validate";

export const checkInRoutes = async (app: FastifyInstance) => {
  app.addHook("onRequest", verifyJWT);

  app.get(
    "/check-ins",
    { onRequest: [verifyRole("ADMIN")] },
    checkInAllHistory,
  );
  app.get("/check-ins/history", checkInHistory);
  app.get("/check-ins/metrics", checkInMetrics);

  app.post("/gyms/:gymId/check-ins", checkInRegister);
  app.patch(
    "/check-ins/:checkInId/validate",
    { onRequest: [verifyRole("ADMIN")] },
    checkInValidate,
  );
};
