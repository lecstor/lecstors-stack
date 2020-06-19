import Objection, { Model, RelationMappings } from "objection";

import BaseModel from "../base/base.model";

import { stringToPrivilegesMap, ownerPrivileges } from "@lecstor/privileges";

import User from "../user/user.model";

import GroupMember from "./member.model";

export type GroupType = "organisation" | "team" | "resource";

const reverse = (str: string) => str.split("").reverse().join("");

export default class Group extends BaseModel {
  readonly id!: string;
  name?: string;
  description?: string;
  groups!: Group[];
  primaryGroupId?: string;
  isPrimary?: boolean;
  privileges?: string;
  type?: GroupType;

  static tableName = "groups";

  static jsonSchema = {
    type: "object",
    properties: {
      id: { type: "string" },
      primaryGroupId: { type: "string" },
      name: { type: "string" },
      description: { type: "string" },
      isPrimary: { type: "boolean" },
      privileges: { type: "string" },
    },
  };

  $parseDatabaseJson(json: Objection.Pojo) {
    json = super.$parseDatabaseJson(json);
    if (json["privileges"] != undefined) {
      json["privileges"] = reverse(json["privileges"]);
    }
    return json;
  }

  $formatDatabaseJson(json: Objection.Pojo) {
    json = super.$formatDatabaseJson(json);
    if (![null, undefined].includes(json["privileges"])) {
      json["privileges"] = reverse(json["privileges"]);
    }
    return json;
  }

  get privilegesMap() {
    if (this.isPrimary) {
      // primary group gets full privileges
      // this means the owners get new privileges automatically
      return { ...ownerPrivileges };
    }
    return this.privileges ? stringToPrivilegesMap(this.privileges) : {};
  }

  static relationMappings = (): RelationMappings => ({
    groups: {
      relation: Model.ManyToManyRelation,
      modelClass: "group/group.model",
      join: {
        from: "groups.id",
        through: {
          modelClass: "group/group_parent.model",
          from: "group_parent_join.groupId",
          to: "group_parent_join.parentId",
        },
        to: "groups.id",
      },
    },
    primaryGroup: {
      relation: Model.BelongsToOneRelation,
      modelClass: Group,
      join: {
        from: "groups.primaryGroupId",
        to: "groups.id",
      },
    },
    members: {
      relation: Model.ManyToManyRelation,
      modelClass: "user/user.model",
      join: {
        from: "groups.id",
        through: {
          modelClass: GroupMember,
          from: "group_members.groupId",
          to: "group_members.userId",
        },
        to: "users.id",
      },
    },
  });

  addMember(user: User) {
    return this.$relatedQuery("members").relate(user);
  }
}
