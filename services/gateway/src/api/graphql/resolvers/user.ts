import { getGroup } from "../../../db/group";
import { createUserInGroup, getUser } from "../../../db/user";
import {
  MutationResolvers,
  QueryResolvers,
  UserResolvers,
} from "../../../types-codegen";

import {
  ensureResourcePrivilege,
  ensureUserPrivilege,
  isAuthenticated,
} from "./authorization";

const User: UserResolvers = {
  emails: async (user) => {
    const emails = await user.$relatedQuery("emails");
    return emails;
  },
  email: async (user) => {
    const emails = await user.$relatedQuery("emails");
    return emails[0].email || null;
  },
};

const Query: QueryResolvers = {
  user: async (_p, args, ctx) => {
    isAuthenticated(ctx);
    const user = await getUser(args.userId);
    ensureUserPrivilege(ctx.authUser, user, "viewUser");
    return user;
  },
  currentUser: (_p, _a, ctx) => {
    isAuthenticated(ctx);
    return getUser(ctx.authUser.id);
  },
};

const Mutation: MutationResolvers = {
  createUser: async (_p, args, ctx) => {
    isAuthenticated(ctx);
    const { groupId, ...user } = args;
    ensureResourcePrivilege(
      ctx.authUser,
      await getGroup(groupId),
      "createUser"
    );
    return createUserInGroup({ groupId, user });
  },
};

export default { Query, Mutation, User };
