import { publish } from "./rabbit";
import { User } from "../db/user";

export function userCreated(user: User) {
  return publish({ key: "user.created", message: user.toJSON() });
}
