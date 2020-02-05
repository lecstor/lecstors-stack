import bcrypt from "bcrypt";
import objection, { UniqueViolationError } from "objection";

import { fillError, emailExists } from "../../errors";

import Credentials from "../../models/auth/credentials.model";
import Email from "../../models/user/email.model";
import EmailVerificationToken from "../../models/user/email-verification-token.model";
import User from "../../models/user/user.model";

type NewUser = {
  firstname?: string;
  surname?: string;
  email: string;
};

export async function createUser(newUser: NewUser) {
  const { firstname, surname, email } = newUser;
  return objection.transaction(User.knex(), async trx => {
    return User.query(trx)
      .allowGraph("[emails]")
      .insertGraph({ firstname, surname, emails: [{ email }] })
      .catch(err => {
        if (
          err instanceof UniqueViolationError &&
          err.constraint === "emails_email_unique"
        ) {
          throw fillError(new Error(), emailExists());
        }
        throw err;
      });
  });
}

export async function verifyEmail({ token }: { token: string }) {
  return objection.transaction(User.knex(), async trx => {
    const tokenRec = await EmailVerificationToken.query(trx)
      .findById(token)
      .eager("[email.user]");
    if (tokenRec.status === "pending") {
      await EmailVerificationToken.query(trx)
        .findById(token)
        .patch({ status: "verified" });
      await Email.query(trx)
        .findById(tokenRec.email.id)
        .patch({ verified: true });
    }
    const { user } = tokenRec.email;
    return user;
  });
}

export async function setCredentials({
  userId,
  username,
  password
}: {
  userId: string;
  username: string;
  password: string;
}) {
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  return Credentials.query().insert({
    providerId: username,
    secret: passwordHash,
    userId,
    strategy: "local"
  });
}

export async function deleteUser(userId: string) {
  return objection.transaction(User.knex(), async trx => {
    await User.query(trx).deleteById(userId);
    return { user: null };
  });
}

export async function devDeleteUser(email: string) {
  return objection.transaction(User.knex(), async trx => {
    const emailRecord = await Email.query()
      .findOne({ email })
      .eager("[user]");
    if (!emailRecord) {
      return { user: null };
    }
    await User.query(trx).deleteById(emailRecord.user.id);
    return { user: null };
  });
}

export async function getEmailVerifyTokens(email: string) {
  const emailRecord = await Email.query()
    .findOne({ email })
    .eager("[verificationTokens]");
  return emailRecord?.verificationTokens;
}
