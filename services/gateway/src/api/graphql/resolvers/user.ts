import { Context as Ctx } from "../context";
import { combineResolvers } from "../utils/combineResolvers";

import { getGroup } from "../../../db/group";
import { createUserInGroup, getUser, NewUser, User } from "../../../db/user";

import {
  ensureResourcePrivilege,
  ensureUserPrivilege,
  isAuthenticated,
} from "./authorization";

type NewUserWGroup = NewUser & { groupId: string };

export default {
  User: {
    emails: async (user: User) => {
      const emails = await user.$relatedQuery("emails");
      return emails;
    },
    email: async (user: User) => {
      const emails = await user.$relatedQuery("emails");
      return emails[0].email;
    },
  },
  Query: {
    user: combineResolvers(
      isAuthenticated,
      async (_p: void, args: { userId: string }, ctx: Ctx) => {
        const user = await getUser(args.userId);
        ensureUserPrivilege(ctx.authUser, user, "viewUser");
        return user;
      }
    ),
    currentUser: combineResolvers(
      isAuthenticated,
      (_p: void, _a: unknown, ctx: Ctx) => getUser(ctx.authUser.id)
    ),
  },
  Mutation: {
    createUser: combineResolvers(
      isAuthenticated,
      async (_p: void, args: NewUserWGroup, ctx: Ctx) => {
        const { groupId, ...user } = args;
        ensureResourcePrivilege(
          ctx.authUser,
          await getGroup(groupId),
          "createUser"
        );
        return createUserInGroup({ groupId, user });
      }
    ),
  },
};
