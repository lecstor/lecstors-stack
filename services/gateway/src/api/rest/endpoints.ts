import express from "express";
import passport from "passport";
import retry from "async-retry";

import { fillError, userNotFound } from "../../errors";
import { setCredentials } from "../../db/user";
import { addGroupMember, createGroup } from "../../db/group";

import {
  createUser,
  deleteUser,
  devDeleteUser,
  getEmailVerifyTokens,
  verifyEmail
} from "../../db/user";
import { userCreated } from "../../pubsub";

export const routes = express.Router();

routes.post("/register", async (req, res, next) => {
  const { firstname, surname, email } = req.body;
  try {
    const user = await createUser({ firstname, surname, email });
    await userCreated(user);

    const org = await createGroup("Organisation", {
      type: "organisation",
      isPrimary: true
    });
    await Promise.all([
      addGroupMember({ groupId: org.id, userId: user.id }),
      createGroup("Team 1", { groupId: org.id, primaryGroupId: org.id })
    ]);

    // const p1 = addGroupMember({ groupId: org.id, userId: user.id });
    // const p2 = await createGroup("Team 1", {
    //   groupId: org.id,
    //   primaryGroupId: org.id
    // });
    // const p3 = await createGroup("Team 2", {
    //   groupId: p2.id,
    //   primaryGroupId: org.id
    // });
    // const p4 = addGroupMember({ groupId: p3.id, userId: user.id });
    // await Promise.all([p1, p4]);

    req.logIn(user, err => {
      if (err) {
        return next(err);
      }
      return res.send(user);
    });
  } catch (err) {
    next(err);
  }
});

routes.post("/verify-email", async (req, res, next) => {
  const { token } = req.body;
  try {
    const user = await verifyEmail({ token });
    if (user) {
      req.logIn(user, err => {
        if (err) {
          return next(err);
        }
        return res.send(user);
      });
    }
  } catch (err) {
    next(err);
  }
});

routes.post("/set-credentials", async (req, res, next) => {
  const { username, password } = req.body;
  try {
    await setCredentials({
      userId: req.user.id,
      username,
      password
    });
    res.send({ ok: true });
  } catch (err) {
    next(err);
  }
});

routes.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(fillError(new Error(), userNotFound()));
    }
    req.logIn(user, err => {
      if (err) {
        return next(err);
      }
      return res.send(user);
    });
  })(req, res, next);
});

routes.post("/logout", (req, res) => {
  req.logout();
  res.send({ ok: true });
});

routes.post("/delete-account", async (req, res) => {
  await deleteUser(req.user.id);
  req.logout();
  res.send({ ok: true });
});

routes.get("/user", async (req, res) => {
  console.log("req.user", req.user);
  res.send({ user: req.user });
});

if (["development", "test"].includes(process.env.NODE_ENV || "")) {
  routes.get("/email-verify-tokens", async (req, res) => {
    const tokens = await retry(
      async () => {
        // if anything throws, we retry
        const tokens = await getEmailVerifyTokens(req.body.email);

        if (!tokens || tokens.length === 0) {
          throw new Error("no tokens");
        }

        return tokens;
      },
      {
        retries: 5
      }
    );
    res.send({ tokens });
  });

  routes.post("/delete-user", async (req, res) => {
    await devDeleteUser(req.body.email);
    req.logout();
    res.send({ ok: true });
  });
}
