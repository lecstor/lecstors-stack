import { Model, RelationMappings } from "objection";

import BaseModel from "../base/base.model";

import Group from "./group.model";

export default class GroupParent extends BaseModel {
  readonly id!: string;
  groupId!: string;
  parentId!: string;

  parent!: Group;
  group!: Group;

  static tableName = "mapGroupParent";

  static jsonSchema = {
    type: "object",
    required: ["groupId", "parentId"],

    properties: {
      id: { type: "uuid" },
      groupId: { type: "uuid" },
      parentId: { type: "uuid" },
    },
  };

  static relationMappings = (): RelationMappings => ({
    group: {
      relation: Model.BelongsToOneRelation,
      modelClass: Group,
      join: {
        from: "mapGroupParent.groupId",
        to: "groups.id",
      },
    },
    parent: {
      relation: Model.BelongsToOneRelation,
      modelClass: Group,
      join: {
        from: "mapGroupParent.parentId",
        to: "groups.id",
      },
    },
  });
}
