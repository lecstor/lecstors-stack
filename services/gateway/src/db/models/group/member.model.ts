import { Model, RelationMappings } from "objection";

import BaseModel from "../base/base.model";

import Group from "./group.model";
import User from "../user/user.model";

export default class Member extends BaseModel {
  readonly id!: string;
  groupId!: string;
  userId!: string;

  user!: User;
  group!: Group;

  static tableName = "groupMembers";

  static jsonSchema = {
    type: "object",
    required: ["groupId", "userId"],

    properties: {
      id: { type: "uuid" },
      groupId: { type: "uuid" },
      userId: { type: "uuid" },
    },
  };

  static relationMappings = (): RelationMappings => ({
    group: {
      relation: Model.BelongsToOneRelation,
      modelClass: Group,
      join: {
        from: "groupMembers.groupId",
        to: "groups.id",
      },
    },
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: "groupMembers.userId",
        to: "users.id",
      },
    },
  });
}
