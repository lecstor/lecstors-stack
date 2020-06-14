import { v4 as uuidv4 } from "uuid";
import { Model, QueryContext } from "objection";

function guid({ field = "id", generateGuid = () => uuidv4() } = {}) {
  return (baseModel: typeof Model) => {
    return class Anon extends baseModel {
      $beforeInsert(context: QueryContext) {
        const parent = super.$beforeInsert(context);

        if (!this[field as keyof Anon]) {
          (this[field as keyof Anon] as unknown) = generateGuid.call(this);
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
