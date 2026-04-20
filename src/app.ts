import { fastify } from "fastify";
import { appRoutes } from "./http/routes";
import * as z from "zod";
import { env } from "./env";

export const app = fastify();

app.register(appRoutes);

app.setErrorHandler((error, _request, reply) => {
  if (error instanceof z.ZodError) {
    return reply
      .code(400)
      .send({ message: "Validation Error", issues: z.treeifyError(error) });
  }

  if (env.NODE_ENV !== "production") {
    console.log(error);
  } else {
    // TODO: use sentry/datadog/graphana or any other log external tool
  }

  return reply.code(500).send({ message: "Internal Server Error" });
});
