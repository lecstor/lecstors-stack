import { Context } from "../../graphql/context";

import User from "./user.model";

export async function user(_: void, args: { id: string }): Promise<User> {
  return User.query().findById(args.id);
}

export async function currentUser(
  _: void,
  _args: {},
  context: Context
): Promise<User | void> {
  return await User.query()
    .findById(context.user.id)
    .debug();
}
