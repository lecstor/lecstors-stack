import { Model, RelationMappings } from "objection";

import Resource from "../base/resource.model";

export default class Group extends Resource {
  readonly id!: string;
  name?: string;
  description?: string;
  // groupId?: string;

  static tableName = "todos";

  static jsonSchema = {
    type: "object",
    properties: {
      id: { type: "string" },
      name: { type: "string" },
      description: { type: "string" },
      groupId: { type: "string" },
    },
  };

  static relationMappings = (): RelationMappings => ({
    group: {
      relation: Model.BelongsToOneRelation,
      modelClass: Group,
      join: {
        from: "todos.groupId",
        to: "groups.id",
      },
    },
  });
}
