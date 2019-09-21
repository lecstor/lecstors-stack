import objection from "objection";

import { Context } from "../../graphql/context";

import { emailExists, ApolloError } from "../../errors";

import User from "./user.model";

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
    await context.auth.login(user);
    return user;
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
