import objection from "objection";

import { Context } from "../../graphql/context";
import { emailExists, ApolloError } from "../../errors";

import { sendUserCreated } from "./tasks/user-created";
import EmailVerificationToken from "../user/email-verification-token.model";
import Email from "../user/email.model";
import User from "../user/user.model";

import { Auth } from "./types";

type NewUser = {
  firstname?: string;
  surname?: string;
  email: string;
};

export async function createUser(_: void, newUser: NewUser, context: Context) {
  const { firstname, surname, email } = newUser;
  return objection.transaction(User.knex(), async trx => {
    const user = await User.query(trx)
      .allowInsert("[emails]")
      .insertGraph({ firstname, surname, emails: [{ email }] })
      .catch(err => {
        if (err.code === "23505") {
          throw new ApolloError(...emailExists({ email }));
        }
        throw err;
      });
    await sendUserCreated(user);
    await context.auth.login(user);
    return { user };
  });
}

export async function verifyEmail(
  _: void,
  { token }: { token: string },
  context: Context
) {
  return objection.transaction(User.knex(), async trx => {
    const tokenRec = await EmailVerificationToken.query(trx)
      .findById(token)
      .eager("[email.user]");
    console.log(JSON.stringify({ token }, null, 2));
    if (tokenRec.status === "pending") {
      await EmailVerificationToken.query(trx)
        .findById(token)
        .patch({ status: "verified" });
      await Email.query(trx)
        .findById(tokenRec.email.id)
        .patch({ verified: true });
    }
    const { user } = tokenRec.email;
    await context.auth.login(user);
    return { user };
  });
}

export async function deleteUser(_: void, __: void, context: Context) {
  return objection.transaction(User.knex(), async trx => {
    const userId = context.user.id;
    await User.query(trx).deleteById(userId);
    await context.auth.logout();
    return { user: null };
  });
}

export async function logout(
  _: void,
  args: void,
  context: Context
): Promise<Auth> {
  await context.auth.logout();
  return { user: undefined };
}

export async function login(
  parent: void,
  { username, password }: { username: string; password: string },
  context: Context
): Promise<Auth> {
  const authResult = await context.auth.authenticate("graphql-local-login", {
    username,
    password
  });
  const { user, info } = authResult;

  console.log({ user, authResult });
  if (user) {
    context.auth.login(user);
    return { user };
  }
  console.log({ info });
  return info;
}
