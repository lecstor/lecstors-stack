import session, { SessionOptions } from "express-session";
import Session from "./db/models/auth/session.model";

export default function connectObjection(appSession: typeof session) {
  class ObjectionStore extends appSession.Store {
    constructor(options?: SessionOptions) {
      super(options);
    }

    get = async function (
      id: string,
      fn: (err: any, session?: Session["data"] | null | undefined) => void
    ) {
      const session = await Session.query().findById(id);
      if (session) {
        const { data } = session;
        return fn(null, data);
      }
      return fn(null);
    };

    set = async function (
      id: string,
      session: Record<string, any>,
      fn?: (error?: any) => void
    ) {
      const updated = await Session.query().findById(id).patch(session);
      if (updated) {
        return fn?.();
      }

      return Session.query()
        .insert({ id, ...session })
        .then(() => fn?.())
        .catch((err) => fn?.(err));
    };

    destroy = async function (id: string, fn?: (error?: any) => void) {
      await Session.query().deleteById(id);
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
