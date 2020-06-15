import { GraphQLResolveInfo as Info, FieldNode } from "graphql";
import { parseResolveInfo } from "graphql-parse-resolve-info";
import objection from "objection";

import { privilegesKeys as PRIV } from "@lecstor/privileges";

import { Context as Ctx } from "../context";

import { MutationResolvers, QueryResolvers } from "../../../types-codegen";

import {
  addGroupMember,
  getGroup,
  getChildren,
  Group,
} from "../../../db/group";

import { isAuthenticated, ensureResourcePrivilege } from "./authorization";
import User from "../../../db/models/user/user.model";

type GroupTreesArgs = {
  groupIds: string[];
  authUser: User;
  fields: string[];
};

// https://github.com/microsoft/TypeScript/issues/16069#issuecomment-519281216
function hasValue<T>(value: T | undefined | null | void): value is T {
  return value !== undefined && value !== null;
}

async function groupsTrees({ groupIds, authUser, fields }: GroupTreesArgs) {
  const trees = await Promise.all(
    groupIds
      .map(async (groupId: string) => {
        const childGroups = await getChildren(groupId, fields);
        if (
          await authUser.hasResourcePrivilege(
            childGroups[0],
            PRIV.viewResources
          )
        ) {
          return childGroups;
        }
      })
      .filter(hasValue)
  );
  return trees.filter(hasValue);
}

function getFieldNode(info: Info) {
  return info.fieldNodes.find((field) => field.name.value === info.fieldName);
}

function getSelectedLocalFields(fieldNode: FieldNode) {
  return fieldNode.selectionSet?.selections
    .filter(
      (fn) =>
        fn.kind === "Field" && !fn.selectionSet && !/^__/.test(fn.name.value)
    )
    .map((fn) => fn.kind === "Field" && fn.name.value);
}

function getSelectedRelatedFields(fieldNode: FieldNode) {
  return fieldNode.selectionSet?.selections
    .filter((fn) => fn.kind === "Field" && fn.selectionSet)
    .map((fn) => (fn.kind === "Field" ? fn.name.value : ""));
}

function setSelections<M extends objection.Model>(
  queryBuilder: objection.QueryBuilder<M, M>,
  info: Info
) {
  const fieldNode = getFieldNode(info);
  if (fieldNode) {
    queryBuilder.select(getSelectedLocalFields(fieldNode));
    getSelectedRelatedFields(fieldNode)?.forEach((field) =>
      queryBuilder.withGraphFetched(field)
    );
  }
}

type AddMemberArgs = { groupId: string; userId: string };

const Query: QueryResolvers = {
  group: async (_p, args, ctx, info) => {
    isAuthenticated(ctx);
    const { groupId } = args;
    const queryBuilder = getGroup(groupId);
    setSelections<Group>(queryBuilder, info);
    const group = await queryBuilder.debug();
    return group;
  },
  groupsTrees: async (_p, args, ctx, info) => {
    isAuthenticated(ctx);
    const parsedInfo = parseResolveInfo(info);
    const [{ groupIds }, { authUser }] = [args, ctx];

    return groupsTrees({
      groupIds,
      authUser,
      fields: parsedInfo ? Object.keys(parsedInfo.fieldsByTypeName.Group) : [],
    });
  },
};

const Mutation: MutationResolvers = {
  addMember: async (_p: unknown, args: AddMemberArgs, ctx: Ctx) => {
    isAuthenticated(ctx);
    const { groupId, userId } = args;
    ensureResourcePrivilege(
      ctx.authUser,
      await getGroup(groupId),
      PRIV.addMember
    );
    return addGroupMember({ groupId, userId });
  },
};

export default { Query, Mutation };
