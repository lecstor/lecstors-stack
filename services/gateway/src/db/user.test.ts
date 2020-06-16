import { Model } from "objection";
import cuid from "cuid";

import { fillError, emailExists, verificationTokenNotFound } from "../errors";

import { createGroup } from "./group";
import {
  createUser,
  createUserInGroup,
  getUser,
  getEmailVerifyTokens,
  setCredentials,
  verifyEmail,
  verifyPassword,
} from "./user";

describe("DB", () => {
  beforeAll(async () => {
    await Model.knex().migrate.rollback();
    await Model.knex().migrate.latest();
  });
  afterAll(() => Model.knex().destroy());

  describe("user", () => {
    describe("createUser", () => {
      test("success", async () => {
        const email = `jason+${cuid()}@lecstor.com`;
        const result = await createUser({ email });
        expect(result.emails[0].email).toEqual(email);
      });

      test("email already registered", async () => {
        const email = `jason+${cuid()}@lecstor.com`;
        await createUser({ email });
        await expect(createUser({ email })).rejects.toEqual(
          fillError(new Error(), emailExists())
        );
      });
    });

    describe("createUserInGroup", () => {
      const email = `jason+${cuid()}@lecstor.com`;

      test("success", async () => {
        const group = await createGroup("g1", { isPrimary: true });

        const result = await createUserInGroup({
          groupId: group.id,
          user: { email },
        });
        expect(result.emails[0].email).toEqual(email);
      });
    });

    describe("getUser", () => {
      test("success", async () => {
        const email = `jason+${cuid()}@lecstor.com`;
        const user = await createUser({ email });
        const result = await getUser(user.id);
        expect(result.id).toEqual(user.id);
      });
    });

    describe("setCredentials", () => {
      const email = `jason+${cuid()}@lecstor.com`;
      const username = cuid();
      const password = "fooBar";

      test("success", async () => {
        const user = await createUser({ email });
        const result = await setCredentials({
          userId: user.id,
          username,
          password,
        });
        expect(result.providerId).toEqual(username);
        expect(result.userId).toEqual(user.id);
        expect(result.strategy).toEqual("local");
        await expect(verifyPassword(username, password)).resolves.toEqual(true);
      });
    });

    describe("verifyEmail", () => {
      const email = `jason+${cuid()}@lecstor.com`;

      test("success", async () => {
        const user = await createUser({ email });
        const tokens = await getEmailVerifyTokens(email);
        const result = await verifyEmail({ token: tokens[0].id });
        expect(result?.id).toEqual(user.id);
      });

      test("fail", async () => {
        const result = verifyEmail({
          token: "387ef478-66a3-4cb3-82e5-a42eaed6be0b",
        });
        await expect(result).rejects.toEqual(
          fillError(new Error(), verificationTokenNotFound())
        );
      });
    });

    describe("verifyPassword", () => {
      const password = "fooBar";

      test("success", async () => {
        const username = cuid();
        const email = `jason+${cuid()}@lecstor.com`;
        const user = await createUser({ email });
        await setCredentials({
          userId: user.id,
          username,
          password,
        });
        await expect(verifyPassword(username, password)).resolves.toEqual(true);
      });

      test("wrong password", async () => {
        const username = cuid();
        const email = `jason+${cuid()}@lecstor.com`;
        const user = await createUser({ email });
        await setCredentials({
          userId: user.id,
          username,
          password,
        });
        await expect(verifyPassword(username, "wrong")).resolves.toEqual(false);
      });

      test("user not found", async () => {
        await expect(
          verifyPassword("daves-not-here-man", "wrong")
        ).resolves.toBeUndefined();
      });
    });
  });
});
