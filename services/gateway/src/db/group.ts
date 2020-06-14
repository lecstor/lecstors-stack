import objection from "objection";

import Group, { GroupType } from "./models/group/group.model";
import User from "./models/user/user.model";
import Resource from "./models/base/resource.model";

import {
  ownerPrivileges,
  privilegesMapToString,
  PrivilegesMapInput,
  stringsToPrivilegesMap
} from "@lecstor/privileges";

type NewMember = {
  groupId: string;
  userId: string;
};

export { Group };

export async function addGroupMember(newMember: NewMember) {
  const { groupId, userId } = newMember;
  return Group.relatedQuery("members")
    .for(groupId)
    .relate(userId);
}

export function getGroup(groupId: string) {
  return Group.query().findById(groupId);
}

type idOrIds = string | string[];
type Fields = string[];

export async function getWithChildren(id: idOrIds, fields: Fields = ["*"]) {
  return Group.query()
    .withRecursive("children", qb => {
      qb.select("groups.*")
        .from("groups")
        .where({ id })
        .unionAll(qb2 => {
          qb2
            .select("groups.*")
            .from("groups")
            .join("children", "children.id", "groups.groupId");
        }, true);
    })
    .select(...(fields?.length ? fields : ["*"]))
    .from("children");
}

export async function getChildren(id: idOrIds, fields: Fields = ["*"]) {
  const withChildren = await getWithChildren(id, fields);
  return withChildren.filter(g => !id.includes(g.id));
}

export async function getWithParents(id: idOrIds, fields: Fields = ["*"]) {
  return Group.query()
    .withRecursive("parents", qb => {
      qb.select("groups.*")
        .from("groups")
        .where({ id })
        .unionAll(qb2 => {
          qb2
            .select("groups.*")
            .from("groups")
            .join("parents", "parents.groupId", "groups.id");
        }, true);
    })
    .select(...(fields?.length ? fields : ["*"]))
    .from("parents");
}

export async function getParents(id: idOrIds, fields: Fields = ["*"]) {
  const withParents = await getWithParents(id, fields);
  return withParents.filter(g => !id.includes(g.id));
}

export async function getPrimaryGroup(groupId: string) {
  const groups = await getWithParents(groupId);
  return groups.find(g => g.isPrimary);
}

// https://realfiction.net/2019/02/03/typescript-type-shenanigans-2-specify-at-least-one-property
// https://stackoverflow.com/questions/40510611/typescript-interface-require-one-of-two-properties-to-exist/49725198#49725198
type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];

type NewGroup = {
  id?: string;
  description?: string;
  groupId?: string;
  primaryGroupId?: string;
  privileges?: PrivilegesMapInput;
  isPrimary?: boolean;
  type?: GroupType;
};

type NewGroupInput = RequireAtLeastOne<NewGroup, "groupId" | "isPrimary">;

export async function createGroup(name: string, newGroup: NewGroupInput) {
  const {
    id,
    description,
    groupId,
    primaryGroupId,
    isPrimary,
    privileges: privilegesMap = {},
    type
  } = newGroup;

  let defaultType: GroupType = "team";
  let derivedPrimaryGroupId: string | undefined;
  let forcedIsPrimary = false;

  if (groupId) {
    if (!primaryGroupId) {
      derivedPrimaryGroupId = (await getPrimaryGroup(groupId))?.id;
    }
  } else {
    if (!isPrimary) {
      throw new Error("groupId or isPrimary must be set when creating a group");
    }
    forcedIsPrimary = true;
    defaultType = "organisation";
  }

  const privileges = privilegesMapToString(
    isPrimary || forcedIsPrimary ? {} : privilegesMap
  );

  return Group.transaction(async trx => {
    return Group.query(trx).insertGraph({
      id,
      name,
      description,
      groupId,
      primaryGroupId: primaryGroupId || derivedPrimaryGroupId,
      isPrimary: Boolean(isPrimary || forcedIsPrimary),
      privileges,
      type: type || defaultType
    });
  });
}

export async function getPrivileges(id: string) {
  const groups = await getWithParents(id, [
    "privileges",
    "primary"
  ]).then(groups => groups.reverse());
  const primary = groups.find(g => g.isPrimary);
  if (primary) {
    // primary group gets full privileges
    // this means the owners get new privileges automatically
    return { ...ownerPrivileges };
  }
  return stringsToPrivilegesMap(groups.map(g => g.privileges || "0"));
}

function privilegesMapToDbString(privs: PrivilegesMapInput) {
  return privilegesMapToString(privs)
    .split("")
    .reverse()
    .join("");
}

export function whereSomePrivileges(privs: PrivilegesMapInput) {
  const privilegesStr = privilegesMapToDbString(privs);
  const len = privilegesStr.length;
  const query = objection.raw(
    `(privileges::bit(${len}) & B'${privilegesStr}') <> 0::bit(${len})`
  );
  return Group.query().where(query);
}

export function whereAllPrivileges(privs: PrivilegesMapInput) {
  const privilegesStr = privilegesMapToDbString(privs);
  const len = privilegesStr.length;
  const query = objection.raw(
    `(privileges::bit(${len}) & B'${privilegesStr}') = B'${privilegesStr}'`
  );
  return Group.query().where(query);
}

function findGroupPrivilege(
  targetGroups: Group[],
  userGroupIds: string[],
  privilege: string
) {
  let isMember = false;
  // recurse down the resource's group tree
  for (const parentGroup of targetGroups.reverse()) {
    if (!isMember && userGroupIds.includes(parentGroup.id)) {
      isMember = true;
    }
    if (isMember && parentGroup.privilegesMap[privilege]) {
      return true;
    }
  }

  return false;
}

type HasResourcePrivilegeArgs = {
  user: User;
  resource: Resource;
  privilege: string;
};

/*
To have a resource privilege a user must be a member of a group which is a parent
of the resource and have that privilege or is a parent to another parent of the
resource with that privilege.
*/
export async function hasResourcePrivilege({
  user,
  resource,
  privilege
}: HasResourcePrivilegeArgs) {
  const userGroupIds = user.groups.map(g => g.id);

  if (!resource.groupId) {
    if (resource instanceof Group) {
      if (resource.isPrimary) {
        if (userGroupIds.includes(resource.id)) {
          return resource.privilegesMap[privilege];
        }
        return false;
      }
      throw new Error(
        "Group is invalid as it is not a primary group and does not have a parent group"
      );
    }
    throw new Error("Resource is invalid as it does not belong to a group");
  }

  const resourceParentGroups = await getWithParents(resource.groupId);
  return findGroupPrivilege(resourceParentGroups, userGroupIds, privilege);
}

type HasUserPrivilegeArgs = {
  authUser: User;
  user: User;
  privilege: string;
};

export async function hasUserPrivilege({
  authUser,
  user,
  privilege
}: HasUserPrivilegeArgs) {
  const authUserGroupIds = authUser.groups.map(g => g.id);
  const userGroupIds = user.groups.map(g => g.id);

  for (const userGroupId of userGroupIds) {
    const userParentGroups = await getWithParents(userGroupId);

    if (findGroupPrivilege(userParentGroups, authUserGroupIds, privilege)) {
      return true;
    }
  }
  return false;
}
