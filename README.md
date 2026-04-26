```shell
npm run dev
```

```shell
docker compose up -d
```

GymPass style app.

- Framework: Fastify
- Build: tsup
- Language: Node.js (module), TypeScript
- Format and linting: Biome
- Data input: Zod
- ORM: Prisma 6
- Dates: dayjs

- repository pattern
- inMemory test database pattern
- factory pattern
- The System Under Test (SUT) is a foundational concept in software testing defined as whatever class, object, method, or entire application is currently being verified by a specific test case.
- TDD - Test Driven Development

## FRs (Functional Requirements)

- [x] It must be possible to register;
- [x] It must be possible to authenticate;
- [x] It must be possible to get the profile of a logged-in user;
- [x] It must be possible to get the number of check-ins performed by the logged-in user;
- [x] It must be possible for the user to get their check-in history;
- [x] It must be possible for the user to search for nearby gyms (até 10km);
- [x] It must be possible for the user to search for gyms by name;
- [x] It must be possible for the user to check-in at a gym;
- [x] It must be possible to validate a user's check-in;
- [x] It must be possible to register a gym;

## BRs (Business Rules)

- [x] The user must not be able to register with a duplicate email;
- [x] The user cannot perform 2 check-ins on the same day;
- [x] The user cannot check-in if they are not close (within 100m) to the gym;
- [x] The check-in can only be validated up to 20 minutes after being created;
- [ ] The check-in can only be validated by administrators;
- [ ] The gym can only be registered by administrators;

## NFRs (Non-functional Requirements)

- [x] The user's password must be encrypted;
- [x] Application data must be persisted in a PostgreSQL database;
- [x] All data lists must be paginated with 20 items per page;
- [ ] The user must be identified by a JWT (JSON Web Token);
