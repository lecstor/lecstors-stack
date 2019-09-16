import User from "../user/user.model";

export function currentUser(
  _: void,
  _args: {},
  context: { user: User }
): User | void {
  return context.user;
}

export function auth(_: void, _args: {}, context: { user: User }) {
  return { user: context.user };
}
