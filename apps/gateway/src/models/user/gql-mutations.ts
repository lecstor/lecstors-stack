import objection from "objection";

import { emailExists, ApolloError } from "../../errors";

import User from "./user.model";

type NewUser = {
  firstname?: string;
  surname?: string;
  email: string;
};

export async function createUser(_: void, newUser: NewUser) {
  const { firstname, surname, email } = newUser;
  return objection.transaction(User.knex(), async trx =>
    User.query(trx)
      .allowInsert("[emails]")
      .insertGraph({ firstname, surname, emails: [{ email }] })
      .catch(err => {
        if (err.code === "23505") {
          throw new ApolloError(...emailExists({ email }));
        }
        throw err;
      })
  );
}
