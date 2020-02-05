import { publish } from "./rabbit";

export function userCreated(user) {
  return publish({ key: "user.created", message: user });
}
