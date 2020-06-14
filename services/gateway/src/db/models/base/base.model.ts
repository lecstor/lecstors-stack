import { Model } from "objection";
import knexConnection from "../../../knex-connection";

import guid from "../guid.objection.plugin";

Model.knex(knexConnection);

export default class BaseModel extends guid()(Model) {
  static get modelPaths() {
    return [`${__dirname}/../`];
  }
}
