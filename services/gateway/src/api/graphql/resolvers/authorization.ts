import { ForbiddenError, AuthenticationError } from "apollo-server-express";
import { skip } from "graphql-resolvers";

import User from "../../../db/models/user/user.model";
import Resource from "../../../db/models/base/resource.model";

import { Context as Ctx } from "../context";

export function isAuthenticated({ authUser }: Ctx) {
  if (authUser) return skip;
  throw new AuthenticationError("not authenticated");
}

export async function ensureGroupPrivilege(
  authUser: User,
  groupId: string,
  privilege: string,
  message = "does not have access"
) {
  if (!(await authUser.hasGroupPrivilege(groupId, privilege))) {
    throw new ForbiddenError(message);
  }
}

export async function ensureGroupChildrenPrivilege(
  authUser: User,
  groupId: string,
  privilege: string,
  message = "does not have access"
) {
  if (!(await authUser.hasGroupChildrenPrivilege(groupId, privilege))) {
    throw new ForbiddenError(message);
  }
}

export async function ensureResourcePrivilege(
  authUser: User,
  resource: Resource,
  privilege: string,
  message = "does not have access"
) {
  if (!(await authUser.hasResourcePrivilege(resource, privilege))) {
    throw new ForbiddenError(message);
  }
}

export async function ensureUserPrivilege(
  authUser: User,
  user: User,
  privilege: string,
  message = "does not have access"
) {
  if (!(await authUser.hasUserPrivilege(user, privilege))) {
    throw new ForbiddenError(message);
  }
}
