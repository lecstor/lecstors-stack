import { Model, RelationMappings } from "objection";

import BaseModel from "../base/base.model";

import Credentials from "../auth/credentials.model";
import Email from "./email.model";

export default class User extends BaseModel {
  readonly id!: string;
  firstname?: string;
  surname?: string;

  credentials!: Credentials[];
  emails!: Email[];

  static tableName = "users";

  // validation schema
  static jsonSchema = {
    type: "object",

    properties: {
      id: { type: "uuid" },
      firstname: { type: "string", minLength: 1, maxLength: 255 },
      surname: { type: "string", minLength: 1, maxLength: 255 }
    }
  };

  static relationMappings: RelationMappings = {
    credentials: {
      relation: Model.HasManyRelation,
      modelClass: Credentials,
      join: {
        from: "users.id",
        to: "credentials.userId"
      }
    },
    emails: {
      relation: Model.HasManyRelation,
      modelClass: Email,
      join: {
        from: "users.id",
        to: "emails.userId"
      }
    }
  };

  static findByUsername = async username => {
    const result = await User.query().whereExists(
      User.relatedQuery("credentials").where("providerId", username)
    );
    return result[0];
  };
}
