import { Model, RelationMappings } from "objection";

import BaseModel from "../base/base.model";

import User from "../user/user.model";

import jsonSchema from "./credentials.schema.json";

export default class Credentials extends BaseModel {
  readonly id!: number;
  strategy!: string;
  providerId!: string;
  secret!: string;
  userId!: string;

  user?: User;

  static tableName = "credentials";

  // validation schema
  static jsonSchema = jsonSchema;

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
