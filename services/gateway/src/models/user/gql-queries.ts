import { Context } from "../../graphql/context";

import User from "./user.model";
import Email from "./email.model";
import EmailVerificationToken from "./email-verification-token.model";

export async function user(_: void, args: { id: string }): Promise<User> {
  return User.query().findById(args.id);
}

export async function currentUser(
  _: void,
  _args: {},
  context: Context
): Promise<User | void> {
  console.log("CONTEXT.USER", context.user);
  return await User.query()
    .findById(context.user.id)
    .eager("[emails.verificationTokens]")
    .debug();
}

export async function tokens(
  _: void,
  { email }: { email: string }
): Promise<EmailVerificationToken[]> {
  const emailRecord = await Email.query().findOne({ email });
  return emailRecord.verificationTokens;
}
