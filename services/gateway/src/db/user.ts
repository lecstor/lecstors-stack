import bcrypt from "bcrypt";
import {
  SingleQueryBuilder,
  QueryBuilderType,
  UniqueViolationError,
} from "objection";

import { fillError, emailExists, verificationTokenNotFound } from "../errors";

import Credentials from "./models/auth/credentials.model";
import Email from "./models/user/email.model";
import EmailVerificationToken from "./models/user/emailVerificationToken.model";
import User from "./models/user/user.model";

import { addGroupMember } from "./group";

export { User };

export async function setCredentials({
  userId,
  username,
  password,
}: {
  userId: string;
  username: string;
  password: string;
}) {
  const salt = await bcrypt.genSalt(15);
  const passwordHash = await bcrypt.hash(password, salt);

  return Credentials.query().insert({
    providerId: username,
    secret: passwordHash,
    userId,
    strategy: "local",
  });
}

export async function verifyPassword(username: string, password: string) {
  const creds = await Credentials.query().findOne({ providerId: username });
  if (!creds) return undefined;
  return bcrypt.compare(password, creds.secret);
}

type EmailId = { emailId: string };

export function createEmailVerificationToken({ emailId }: EmailId) {
  return EmailVerificationToken.query().insert({ emailId, status: "pending" });
}

export function findEmailVerificationToken({ emailId }: EmailId) {
  return EmailVerificationToken.query().where({ emailId, status: "pending" });
}

export type NewUser = {
  firstname?: string;
  surname?: string;
  email: string;
};

export async function createUser(newUser: NewUser) {
  const { firstname, surname, email } = newUser;
  const user = await User.transaction(async (trx) => {
    return User.query(trx)
      .allowGraph("[emails]")
      .insertGraph({ firstname, surname, emails: [{ email }] })
      .catch((err) => {
        if (
          err instanceof UniqueViolationError &&
          err.constraint === "emails_email_unique"
        ) {
          throw fillError(new Error(), emailExists());
        }
        throw err;
      });
  });
  const { id } = user.emails[0];
  await createEmailVerificationToken({ emailId: id });
  return user;
}

type CreateUserInGroup = { groupId: string; user: NewUser };

export async function createUserInGroup({
  groupId,
  user,
}: CreateUserInGroup): Promise<User> {
  const newUser = await createUser(user);
  await addGroupMember({ groupId, userId: newUser.id });
  newUser.groups = await newUser.$relatedQuery("groups");
  return newUser;
}

export function asAuthUser(
  queryBuilder: SingleQueryBuilder<QueryBuilderType<User>>
) {
  return queryBuilder
    .withGraphFetched("groups")
    .withGraphFetched("groups.primaryGroup");
}

export function getUser(userId: string) {
  return User.query().findById(userId);
}

export function getUserByUsername(username: string) {
  return User.query()
    .whereExists(User.relatedQuery("credentials").where("providerId", username))
    .first();
}

export async function verifyEmail({ token }: { token: string }) {
  return User.transaction(async (trx) => {
    const tokenRec = await EmailVerificationToken.query(trx)
      .findById(token)
      .withGraphFetched("email.user");

    if (!tokenRec?.email) {
      throw fillError(new Error(), verificationTokenNotFound());
    }

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

export async function deleteUser(userId: string) {
  return User.transaction(async (trx) => {
    await User.query(trx).deleteById(userId);
    return { user: null };
  });
}

export async function devDeleteUser(email: string) {
  return User.transaction(async (trx) => {
    const emailRecord = await Email.query()
      .findOne({ email })
      .withGraphFetched("user");
    if (!emailRecord?.user) {
      return { user: null };
    }
    await User.query(trx).deleteById(emailRecord.user.id);
    return { user: null };
  });
}

export async function getEmailVerifyTokens(email: string) {
  const emailRecord = await Email.query()
    .findOne({ email })
    .withGraphFetched("verificationTokens");
  return emailRecord?.verificationTokens;
}
