import { Model, RelationMappings } from "objection";

import User from "../user/user.model";

import jsonSchema from "./session.schema.json";

export default class Session extends Model {
  readonly id!: string;
  data!: {
    cookie: Express.SessionCookieData;
    passport: {
      user: string;
    };
  };

  static tableName = "sessions";

  // validation schema
  static jsonSchema = jsonSchema;

  static relationMappings: RelationMappings = {
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: "sessions.userId",
        to: "users.id",
      },
    },
  };
}
