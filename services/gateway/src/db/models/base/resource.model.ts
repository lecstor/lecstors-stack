import BaseModel from "./base.model";
import Group from "../group/group.model";

export default class Resource extends BaseModel {
  readonly id!: string;
  groupId!: string;
  group?: Group;
}
