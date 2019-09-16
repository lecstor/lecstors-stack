import { Model, RelationMappings } from "objection";

import BaseModel from "../base/base.model";

import User from "./user.model";

export default class Email extends BaseModel {
  readonly id!: string;
  email?: string;
  verified?: boolean;
  userId!: string;

  user?: User;

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

  static relationMappings: RelationMappings = {
    credentials: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: "emails.userId",
        to: "users.id"
      }
    }
  };
}
