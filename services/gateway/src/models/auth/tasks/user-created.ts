import { listen, publish } from "../../../rabbit";

import EmailVerificationToken from "../../user/email-verification-token.model";

export async function userCreated(user) {
  // console.log(JSON.stringify({ user }, null, 2));
  console.log(`Sending invite to ${user.emails[0].email}`);

  const token = await EmailVerificationToken.query()
    .insert({
      emailId: user.emails[0].id,
      status: "pending"
    })
    .catch(console.log);
  if (token) {
    console.log(`Need to send token ${token.id} to ${user.emails[0].email}`);
  }
  return token;
}

export function sendUserCreated(user) {
  return publish({ key: "user.created", message: user });
}

export default async function init() {
  await listen({ keys: ["user.created"], fn: userCreated });
  console.log("Listening for user.created");
}
