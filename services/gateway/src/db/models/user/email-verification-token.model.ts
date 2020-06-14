import { Model, RelationMappings } from "objection";

import BaseModel from "../base/base.model";

import Email from "./email.model";

export default class EmailVerificationToken extends BaseModel {
  readonly id!: string;
  emailId!: string;
  status!: string;

  email?: Email;

  static tableName = "email_verification_tokens";

  // validation schema
  static jsonSchema = {
    type: "object",
    required: ["emailId"],

    properties: {
      id: { type: "uuid" },
      emailId: { type: "uuid" },
      status: { type: "string" }
    }
  };

  static relationMappings = (): RelationMappings => ({
    email: {
      relation: Model.BelongsToOneRelation,
      modelClass: Email,
      join: {
        from: "email_verification_tokens.emailId",
        to: "emails.id"
      }
    }
  });
}
