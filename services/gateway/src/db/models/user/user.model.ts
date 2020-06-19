import { Model, RelationMappings } from "objection";

import BaseModel from "../base/base.model";
import Resource from "../base/resource.model";

import Credentials from "../auth/credentials.model";
import Group from "../group/group.model";
import GroupMember from "../group/member.model";

import Email from "./email.model";
import {
  userHasResourcePrivilege,
  userHasGroupPrivilege,
  userHasGroupChildrenPrivilege,
  userHasUserPrivilege,
} from "../../group";

export default class User extends BaseModel {
  readonly id!: string;
  firstname?: string;
  surname?: string;

  credentials!: Credentials[];
  emails!: Email[];
  groups!: Group[];
  groupMemberships!: GroupMember[];

  static tableName = "users";

  // validation schema
  static jsonSchema = {
    type: "object",

    properties: {
      id: { type: "string" },
      firstname: { type: "string", minLength: 1, maxLength: 100 },
      surname: { type: "string", minLength: 1, maxLength: 100 },
    },
  };

  async loadEmails() {
    this.emails = await this.$relatedQuery("emails");
  }

  hasGroupPrivilege(groupId: string, privilege: string) {
    return userHasGroupPrivilege({ authUser: this, privilege, groupId });
  }

  hasGroupChildrenPrivilege(groupId: string, privilege: string) {
    return userHasGroupChildrenPrivilege({
      authUser: this,
      privilege,
      groupId,
    });
  }

  hasResourcePrivilege(resource: Resource, privilege: string) {
    return userHasResourcePrivilege({ authUser: this, privilege, resource });
  }

  hasUserPrivilege(user: User, privilege: string) {
    return userHasUserPrivilege({ authUser: this, privilege, user });
  }

  addGroup(group: Group) {
    return this.$relatedQuery("groups").relate(group);
  }

  static addGroup(userId: string, groupId: string) {
    return Group.relatedQuery("groups").for(userId).relate(groupId);
  }

  static relationMappings: RelationMappings = {
    credentials: {
      relation: Model.HasManyRelation,
      modelClass: "auth/credentials.model",
      join: {
        from: "users.id",
        to: "credentials.userId",
      },
    },
    emails: {
      relation: Model.HasManyRelation,
      modelClass: "user/email.model",
      join: {
        from: "users.id",
        to: "emails.userId",
      },
    },
    groupMemberships: {
      relation: Model.HasManyRelation,
      modelClass: "group/member.model",
      join: {
        from: "users.id",
        to: "group_members.userId",
      },
    },
    groups: {
      relation: Model.ManyToManyRelation,
      modelClass: "group/group.model",
      join: {
        from: "users.id",
        through: {
          modelClass: "group/member.model",
          from: "group_members.userId",
          to: "group_members.groupId",
        },
        to: "groups.id",
      },
    },
  };
}
