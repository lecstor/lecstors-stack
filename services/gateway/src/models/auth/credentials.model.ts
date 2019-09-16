import { Model, RelationMappings } from "objection";

import BaseModel from "../base/base.model";

import User from "../user/user.model";

export default class Credentials extends BaseModel {
  readonly id!: number;
  strategy!: string;
  providerId!: string;
  secret!: string;
  userId!: string;

  user?: User;

  static tableName = "credentials";

  // validation schema
  static jsonSchema = {
    type: "object",
    required: ["strategy", "userId"],

    properties: {
      id: { type: "uuid" },
      userId: { type: "uuid" },
      strategy: { type: "string" },
      providerId: { type: "string" },
      secret: { type: "string" }
    }
  };

  static relationMappings: RelationMappings = {
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: "credentials.userId",
        to: "users.id"
      }
    }
  };
}
