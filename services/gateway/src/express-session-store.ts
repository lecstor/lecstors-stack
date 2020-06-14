import session, { SessionOptions } from "express-session";
import Sessions from "./db/models/auth/session.model";

export default function connectObjection(appSession: typeof session) {
  class ObjectionStore extends appSession.Store {
    constructor(options?: SessionOptions) {
      super(options);
    }

    get = async function(id: string, fn: Function) {
      const session = await Sessions.query().findById(id);
      if (session) {
        const { userId, data } = session;
        return fn(null, { ...data, userId });
      }
      return fn();
    };

    set = async function(
      id: string,
      session: Record<string, any>,
      fn?: (error?: any) => void
    ) {
      const { userId, ...data } = session;
      const updated = await Sessions.query()
        .findById(id)
        .patch({ userId, data });
      if (updated) {
        return fn?.();
      }

      return Sessions.query()
        .insert({ id, userId, data })
        .then(() => fn?.())
        .catch(err => fn?.(err));
    };

    destroy = async function(id: string, fn?: (error?: any) => void) {
      await Sessions.query().deleteById(id);
      fn?.();
    };

    // touch = function(sid, sess, fn) {
    //   const expireTime = this.getExpireTime(sess.cookie.maxAge);
    //   this.query(
    //     "UPDATE " +
    //       this.quotedTable() +
    //       " SET expire = to_timestamp($1) WHERE sid = $2 RETURNING sid",
    //     [expireTime, sid],
    //     function(err) {
    //       fn(err);
    //     }
    //   );
    // };
  }

  return ObjectionStore;
}
