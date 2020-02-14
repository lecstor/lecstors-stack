import config from "@lecstor/config";

import { listen } from "../pubsub/rabbit";

import { sendMail } from "./sendgrid";

import EmailVerificationToken from "../models/user/email-verification-token.model";

export async function userCreated(user) {
  const { firstname, surname, emails } = user;
  const { id, email } = emails[0];

  const token = await EmailVerificationToken.query()
    .insert({ emailId: id, status: "pending" })
    .catch(console.log);

  if (token) {
    const verificationUrl = `${config.gateway.url.external}/verify-email/${token.id}`;

    if (config.notifications.sendEmailVerification) {
      console.log(`DONE: send token ${token.id} to ${email}`);
      sendMail({
        to: `${firstname} ${surname} <${email}>`,
        from: "Jason Galea <jason@lecstor.com>",
        subject: "Welcome to Lecstor!",
        // text: "and easy to do anywhere, even with Node.js",
        html: `<a href="${verificationUrl}">Click to verify your email</a>`
      });
    } else {
      console.log(`Verify email at: ${verificationUrl}`);
    }
  }
  return token;
}

export default async function init() {
  await listen({ keys: ["user.created"], fn: userCreated });
  console.log("pubsub: Notifications subscribed to user.created");
}
