import { v4 as uuidv4 } from "uuid";
import { Model, QueryContext } from "objection";

function guid({ field = "id", generateGuid = () => uuidv4() } = {}) {
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
