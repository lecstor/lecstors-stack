import { Model, RelationMappings } from "objection";

import User from "../user/user.model";

export default class Session extends Model {
  readonly id!: string;
  userId?: string;
  data!: {
    [key: string]: any;
  };

  static tableName = "sessions";

  // validation schema
  static jsonSchema = {
    type: "object",

    properties: {
      id: { type: "string" },
      userId: { type: "uuid" },
      data: { type: "object" }
    }
  };

  static relationMappings: RelationMappings = {
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: "sessions.userId",
        to: "users.id"
      }
    }
  };
}
