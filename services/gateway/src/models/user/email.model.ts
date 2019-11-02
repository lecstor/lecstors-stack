import { Model, RelationMappings } from "objection";

import BaseModel from "../base/base.model";

import User from "./user.model";
import VerificationToken from "./email-verification-token.model";

export default class Email extends BaseModel {
  readonly id!: string;
  email?: string;
  verified?: boolean;
  userId!: string;

  user?: User;
  verificationTokens!: VerificationToken[];

  static tableName = "emails";

  // validation schema
  static jsonSchema = {
    type: "object",
    required: ["email", "userId"],

    properties: {
      id: { type: "uuid" },
      userId: { type: "uuid" },
      verified: { type: "boolean" },
      email: { type: "string", minLength: 5, maxLength: 254 }
    }
  };

  static relationMappings = (): RelationMappings => ({
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: "emails.userId",
        to: "users.id"
      }
    },
    verificationTokens: {
      relation: Model.HasManyRelation,
      modelClass: VerificationToken,
      join: {
        from: "emails.id",
        to: "email_verification_tokens.emailId"
      }
    }
  });
}
