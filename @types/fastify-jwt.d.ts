import type { Roles } from "@/generated/prisma/enums";
import "@fastify/jwt";

declare module "@fastify/jwt" {
  export interface FastifyJWT {
    user: {
      sub: string;
      role: Roles;
    };
  }
}
