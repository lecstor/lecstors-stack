import util from "util";
import session from "express-session";
import Sessions from "./models/auth/session.model";

export default function connectObjection(appSession: typeof session) {
  const Store = appSession.Store; // || session.session.Store;

  const PGStore = function(options = {}): void {
    Store.call(this, options);
  };

  /**
   * Inherit from `Store`.
   */
  util.inherits(PGStore, Store);

  /**
   * Attempt to fetch session by the given `sid`.
   *
   * @param {String} sid – the session id
   * @param {Function} fn – a standard Node.js callback returning the parsed session object
   * @access public
   */

  PGStore.prototype.get = async function(id: string, fn: Function) {
    const session = await Sessions.query().findById(id);
    if (session) {
      const { userId, data } = session;
      return fn(null, { ...data, userId });
    }
    return fn();
  };

  /**
   * Commit the given `sess` object associated with the given `sid`.
   *
   * @param {String} sid – the session id
   * @param {Object} sess – the session object to store
   * @param {Function} fn – a standard Node.js callback returning the parsed session object
   * @access public
   */

  PGStore.prototype.set = async function(
    id: string,
    sess: Record<string, any>,
    fn: Function
  ) {
    const { userId, ...data } = sess;
    const updated = await Sessions.query()
      .findById(id)
      .patch({ userId, data });
    if (updated) {
      return fn.call(this);
    }

    return Sessions.query()
      .insert({ id, userId, data })
      .then(() => fn.call(this))
      .catch(err => fn.call(this, err));

    // .then(() => fn.call(this))
    // .catch(console.log);

    // const expireTime = this.getExpireTime(sess.cookie.maxAge);
    // const query =
    //   "INSERT INTO " +
    //   this.quotedTable() +
    //   " (sess, expire, sid) SELECT $1, to_timestamp($2), $3 ON CONFLICT (sid) DO UPDATE SET sess=$1, expire=to_timestamp($2) RETURNING sid";

    // this.query(query, [sess, expireTime, sid], function(err) {
    //   if (fn) {
    //     fn.call(this, err);
    //   }
    // });
  };

  /**
   * Destroy the session associated with the given `sid`.
   *
   * @param {String} sid – the session id
   * @access public
   */

  PGStore.prototype.destroy = async function(id: string, fn: Function) {
    await Sessions.query().deleteById(id);
    fn.call(this);
  };

  /**
   * Touch the given session object associated with the given session ID.
   *
   * @param {String} sid – the session id
   * @param {Object} sess – the session object to store
   * @param {Function} fn – a standard Node.js callback returning the parsed session object
   * @access public
   */

  // PGStore.prototype.touch = function(sid, sess, fn) {
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

  return PGStore;
}
