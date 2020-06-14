import { GraphQLFieldResolver, GraphQLResolveInfo as Info } from "graphql";

import { Context as Ctx } from "../context";

export const skip = undefined;

export const combineResolvers = <Args, Source = unknown>(
  ...funcs: GraphQLFieldResolver<Source, Ctx, Args>[]
) => (parent: Source, args: Args, context: Ctx, info: Info) =>
  funcs.reduce(
    (prevPromise, resolver) =>
      prevPromise.then((prev: unknown) =>
        prev === skip ? resolver(parent, args, context, info) : prev
      ),
    Promise.resolve()
  );
