import objection from "objection";

import Group, { GroupType } from "./models/group/group.model";
import User from "./models/user/user.model";
import Resource from "./models/base/resource.model";

import {
  ownerPrivileges,
  privilegesMapToString,
  PrivilegesMapInput,
  stringsToPrivilegesMap,
} from "@lecstor/privileges";

type NewMember = {
  groupId: string;
  userId: string;
};

export { Group };

export async function addGroupMember(newMember: NewMember) {
  const { groupId, userId } = newMember;
  return Group.relatedQuery("members").for(groupId).relate(userId);
}

export function getGroup(groupId: string) {
  return Group.query().findById(groupId);
}

type idOrIds = string | string[];
type Fields = string[];

function uniqueGroups(groups: Group[]) {
  const hasOne: { [id: string]: boolean } = {};
  return groups.filter((g) => {
    if (hasOne[g.id]) return false;
    hasOne[g.id] = true;
    return true;
  });
}

export async function getChildren(id: idOrIds, fields: Fields = ["*"]) {
  const ids = Array.isArray(id) ? id : [id];
  return Group.query()
    .withRecursive("children", (qb) => {
      qb.select(["group_id", "parent_id"])
        .from("group_parent_join")
        .whereIn("parent_id", ids)
        .unionAll((qb2) => {
          qb2
            .select([
              "group_parent_join.group_id",
              "group_parent_join.parent_id",
            ])
            .from("group_parent_join")
            .join(
              "children",
              "group_parent_join.parent_id",
              "children.group_id"
            );
        }, true);
    })
    .select(...fields.map((f) => `groups.${f}`))
    .from("groups")
    .join("children", "children.group_id", "groups.id");
}

export async function getWithChildren(id: idOrIds, fields: Fields = ["*"]) {
  const ids = Array.isArray(id) ? id : [id];
  const [groups, children] = await Promise.all([
    Group.query()
      .whereIn("id", ids)
      .select(...fields.map((f) => `groups.${f}`)),
    getChildren(id, fields),
  ]);
  return uniqueGroups([...groups, ...children]);
}

export async function getParents(id: idOrIds, fields: Fields = ["*"]) {
  const ids = Array.isArray(id) ? id : [id];
  return Group.query()
    .withRecursive("parents", (qb) => {
      qb.select(["group_id", "parent_id"])
        .from("group_parent_join")
        .whereIn("group_id", ids)
        .unionAll((qb2) => {
          qb2
            .select([
              "group_parent_join.group_id",
              "group_parent_join.parent_id",
            ])
            .from("group_parent_join")
            .join("parents", "group_parent_join.group_id", "parents.parent_id");
        }, true);
    })
    .select(...fields.map((f) => `groups.${f}`))
    .from("groups")
    .join("parents", "parents.parent_id", "groups.id")
    .debug();
}

export async function getWithParents(id: idOrIds, fields: Fields = ["*"]) {
  const ids = Array.isArray(id) ? id : [id];
  const [groups, parents] = await Promise.all([
    Group.query()
      .whereIn("id", ids)
      .select(...fields.map((f) => `groups.${f}`)),
    getParents(id, fields),
  ]);
  return uniqueGroups([...groups, ...parents]);
}

export async function getPrimaryGroup(groupId: string) {
  const groups = await getWithParents(groupId);
  return groups.find((g) => g.isPrimary);
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
  parentId?: string;
  primaryGroupId?: string;
  privileges?: PrivilegesMapInput;
  isPrimary?: boolean;
  type?: GroupType;
};

type NewGroupInput = RequireAtLeastOne<NewGroup, "parentId" | "isPrimary">;

export async function createGroup(name: string, newGroup: NewGroupInput) {
  const {
    id,
    description,
    parentId,
    primaryGroupId,
    isPrimary,
    privileges: privilegesMap = {},
    type,
  } = newGroup;

  let defaultType: GroupType = "team";
  let derivedPrimaryGroupId: string | undefined;
  let forcedIsPrimary = false;

  if (parentId) {
    if (!primaryGroupId) {
      derivedPrimaryGroupId = (await getPrimaryGroup(parentId))?.id;
    }
  } else {
    if (!isPrimary) {
      throw new Error(
        "parentId or isPrimary must be set when creating a group"
      );
    }
    forcedIsPrimary = true;
    defaultType = "organisation";
  }

  const privileges = privilegesMapToString(
    isPrimary || forcedIsPrimary ? {} : privilegesMap
  );

  return Group.transaction(async (trx) => {
    return Group.query(trx).insertGraph(
      {
        id,
        name,
        description,
        primaryGroupId: primaryGroupId || derivedPrimaryGroupId,
        isPrimary: Boolean(isPrimary || forcedIsPrimary),
        privileges,
        type: type || defaultType,
        parents: parentId ? [{ id: parentId }] : [],
      },
      { relate: true }
    );
  });
}

export async function addGroupParent(groupId: string, parentId: string) {
  return Group.relatedQuery("parents").for(groupId).relate(parentId);
}

export async function getPrivileges(id: string) {
  const groups = await getWithParents(id, [
    "privileges",
    "is_primary",
  ]).then((groups) => groups.reverse());
  const primary = groups.find((g) => g.isPrimary);
  if (primary) {
    // primary group gets full privileges
    // this means the owners get new privileges automatically
    return { ...ownerPrivileges };
  }
  return stringsToPrivilegesMap(groups.map((g) => g.privileges || "0"));
}

function privilegesMapToDbString(privs: PrivilegesMapInput) {
  return privilegesMapToString(privs).split("").reverse().join("");
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

async function userGroupsHaveGroupPrivilege(
  groupAndParents: Group[],
  userGroupIds: string[],
  privilege: string
) {
  const groups = await Group.fetchGraph(groupAndParents, "parents(selectId)", {
    skipFetched: true,
  }).modifiers({ selectId: (builder) => builder.select("groups.id") });

  const memberGroupTree: { [groupId: string]: boolean } = {};

  for (const parentGroup of groups.reverse()) {
    if (
      userGroupIds.includes(parentGroup.id) ||
      parentGroup.parents.find((p) => memberGroupTree[p.id])
    ) {
      if (parentGroup.privilegesMap[privilege]) {
        return true;
      }
      memberGroupTree[parentGroup.id] = true;
    }
  }

  return false;
}

type HasGroupPrivilegeArgs = {
  authUser: User;
  groupId: string;
  privilege: string;
};

/*
 *  Checks that the authenticated user has the privilege to operate on the group itself.
 *
 *  If the group is a primary group then the user will need to be a member of that group,
 *  or one of it's parent groups, with the privilege set.
 *
 *  If the group is not a primary group then the user will need to be a member of one of
 *  it's parent groups with the privilege set.
 */
export async function userHasGroupPrivilege({
  authUser,
  groupId,
  privilege,
}: HasGroupPrivilegeArgs) {
  const userGroupIds = authUser.groups.map((g) => g.id);
  const groups = await getWithParents(groupId);
  const group = groups.find((g) => groupId === g.id);
  if (group?.isPrimary) {
    return userGroupsHaveGroupPrivilege(groups, userGroupIds, privilege);
  }
  const parents = groups.filter((g) => groupId !== g.id);
  return userGroupsHaveGroupPrivilege(parents, userGroupIds, privilege);
}

type HasGroupChildrenPrivilegeArgs = {
  authUser: User;
  groupId: string;
  privilege: string;
};

/*
 *  Checks that the authenticated user has the privilege to operate on the group's children.
 *
 *  The user will need to be a member of that group, or one of it's parent groups, with the
 *  privilege set.
 */
export async function userHasGroupChildrenPrivilege({
  authUser,
  groupId,
  privilege,
}: HasGroupChildrenPrivilegeArgs) {
  const authUserGroupIds = authUser.groups.map((g) => g.id);
  const parentGroups = await getWithParents(groupId);
  return userGroupsHaveGroupPrivilege(
    parentGroups,
    authUserGroupIds,
    privilege
  );
}

type HasResourcePrivilegeArgs = {
  authUser: User;
  resource: Resource;
  privilege: string;
};

/*
 *  Checks that the authenticated user has the privilege to operate on the resource's
 *  group's children.
 *
 *  The user will need to be a member of that group, or one of it's parent groups,
 *  with the privilege set.
 */
export async function userHasResourcePrivilege({
  authUser,
  resource,
  privilege,
}: HasResourcePrivilegeArgs) {
  const { groupId } = resource;
  return userHasGroupChildrenPrivilege({ authUser, groupId, privilege });
}

type HasUserPrivilegeArgs = {
  authUser: User;
  user: User;
  privilege: string;
};

/*
 *  Checks that the authenticated user has the privilege to operate on at least one of
 *  the user's groups' children.
 *
 *  The user will need to be a member of that group, or one of it's parent groups, with
 *  the privilege set.
 */
export async function userHasUserPrivilege({
  authUser,
  user,
  privilege,
}: HasUserPrivilegeArgs) {
  const userGroupIds = user.groups.map((g) => g.id);

  for (const groupId of userGroupIds) {
    if (userHasGroupChildrenPrivilege({ authUser, groupId, privilege })) {
      return true;
    }
  }
  return false;
}
