import uuid from "uuid";
import { Model, QueryContext } from "objection";

function guid({ field = "id", generateGuid = () => uuid.v4() } = {}) {
  return (baseModel: typeof Model) => {
    return class extends baseModel {
      $beforeInsert(context: QueryContext) {
        const parent = super.$beforeInsert(context);

        if (!this[field]) {
          this[field] = generateGuid.call(this);
        }
        return parent;
        // return Promise.resolve(parent)
        //   .then(() => this[field] || generateGuid.call(this))
        //   .then(guid => {
        //     this[field] = guid;
        //   });
      }
    };
  };
}

export default guid;
