import { GraphQLResolveInfo as Info, FieldNode } from "graphql";
import { parseResolveInfo } from "graphql-parse-resolve-info";
import objection from "objection";

import { privilegesKeys as PRIV } from "@lecstor/privileges";

import { Context as Ctx } from "../context";
import { combineResolvers } from "../utils/combineResolvers";

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

async function groupsTrees({ groupIds, authUser, fields }: GroupTreesArgs) {
  const trees = await Promise.all(
    groupIds.map(async (groupId: string) => {
      const childGroups = await getChildren(groupId, fields);
      if (
        await authUser.hasResourcePrivilege(childGroups[0], PRIV.viewResources)
      ) {
        return childGroups;
      }
    })
  );
  return trees;
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

type QGroupTreesArgs = { groupIds: string[] };
type QMembersArgs = { groupId: string };

type AddMemberArgs = { groupId: string; userId: string };

export default {
  Query: {
    group: combineResolvers<QMembersArgs>(
      isAuthenticated,
      async (_p: unknown, args: QMembersArgs, ctx: Ctx, info: Info) => {
        const { groupId } = args;
        const queryBuilder = getGroup(groupId);
        setSelections<Group>(queryBuilder, info);
        const group = await queryBuilder.debug();
        return group;
      }
    ),
    groupsTrees: combineResolvers<QGroupTreesArgs>(
      isAuthenticated,
      (_p: unknown, args: QGroupTreesArgs, ctx: Ctx, info: Info) => {
        const parsedInfo = parseResolveInfo(info);
        const [{ groupIds }, { authUser }] = [args, ctx];

        return groupsTrees({
          groupIds,
          authUser,
          fields: parsedInfo
            ? Object.keys(parsedInfo.fieldsByTypeName.Group)
            : [],
        });
      }
    ),
  },
  Mutation: {
    addMember: combineResolvers<AddMemberArgs>(
      isAuthenticated,
      async (_p: unknown, args: AddMemberArgs, ctx: Ctx) => {
        const { groupId, userId } = args;
        ensureResourcePrivilege(
          ctx.authUser,
          await getGroup(groupId),
          PRIV.addMember
        );
        return addGroupMember({ groupId, userId });
      }
    ),
  },
};
