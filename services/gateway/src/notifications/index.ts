import config from "@lecstor/config";
import { User as UserModel } from "../db/user";
import { ModelObject } from "objection";

import { listen } from "../pubsub/rabbit";

import { sendMail } from "./sendgrid";

import { findEmailVerificationToken } from "../db/user";

type User = ModelObject<UserModel>;

export async function userCreated(user: User) {
  const { firstname, surname, emails } = user;
  const { id, email } = emails[0];

  const tokens = await findEmailVerificationToken({ emailId: id });
  const token = tokens[0];

  if (token) {
    const verificationUrl = `${config.gateway.url.external}/verify-email/${token.id}`;

    if (config.notifications.sendEmailVerification) {
      console.log(`DONE: send token ${token.id} to ${email}`);
      sendMail({
        to: `${firstname} ${surname} <${email}>`,
        from: "Jason Galea <jason@lecstor.com>",
        subject: "Welcome to Lecstor!",
        // text: "and easy to do anywhere, even with Node.js",
        html: `<a href="${verificationUrl}">Click to verify your email</a>`,
      });
    } else {
      console.log(`Verify email at: ${verificationUrl}`);
    }
  }
  return token;
}

export default function init() {
  return listen<User>({ keys: ["user.created"], fn: userCreated })
    .then(() => console.log("pubsub: Notifications subscribed to user.created"))
    .catch(console.log);
}
