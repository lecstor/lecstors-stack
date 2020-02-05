import { listen } from "../pubsub/rabbit";

import EmailVerificationToken from "../models/user/email-verification-token.model";

export async function userCreated(user) {
  const { id, email } = user.emails[0];

  const token = await EmailVerificationToken.query()
    .insert({ emailId: id, status: "pending" })
    .catch(console.log);

  if (token) {
    console.log(`TODO: send token ${token.id} to ${email}`);
  }
  return token;
}

export default async function init() {
  await listen({ keys: ["user.created"], fn: userCreated });
  console.log("pubsub: Notifications subscribed to user.created");
}
