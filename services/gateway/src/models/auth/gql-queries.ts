import { Context } from "../../graphql/context";
import { Auth } from "./types";

export function auth(_: void, _args: {}, context: Context): Auth {
  return { user: context.user };
}
