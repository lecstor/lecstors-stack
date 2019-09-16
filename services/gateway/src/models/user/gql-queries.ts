import User from "./user.model";

export async function user(_: void, args: { id: string }): Promise<User> {
  return User.query().findById(args.id);
}
