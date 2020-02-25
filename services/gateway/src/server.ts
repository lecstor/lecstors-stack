import express from "express";
import { ApolloServer } from "apollo-server-express";
// import depthLimit from 'graphql-depth-limit';
import { createServer } from "http";
import compression from "compression";
import session, { SessionOptions } from "express-session";
import morgan from "morgan";
import uuid from "uuid/v4";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import passport from "passport";

import cors from "cors";

import globalConfig from "@lecstor/config";
import sessionStore from "./express-session-store";
import schema from "./graphql/schema";
import { getContext } from "./graphql/context";
import initNotifications from "./notifications";
import { routes as authRoutes } from "./api/auth";

const config = globalConfig.gateway;

const app = express();

const sessionOptions: SessionOptions = {
  ...config.session,
  store: new (sessionStore(session))(),
  genid: () => uuid(),
  cookie: config.session.cookie
};

if (config.trustProxy) {
  app.set("trust proxy", config.trustProxy);
}
app.use(morgan("combined"));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session(sessionOptions));
app.use("*", cors(config.cors));
app.use(compression());
app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoutes);

function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  console.log(err);
  res.status(401);
  res.send({ error: { ...err, message: err.message } });
}

app.use(errorHandler);

const server = new ApolloServer({
  schema,
  debug: config.graphql.debug,
  // validationRules: [depthLimit(7)],
  context: getContext,

  formatError: error => {
    if (config.graphql.debug) {
      console.log("Error", JSON.stringify(error));
    }
    return error;
  },

  formatResponse: response => {
    if (config.graphql.debug) {
      console.log("Response", JSON.stringify(response));
    }
    return response;
  }
});

server.applyMiddleware({
  app,
  path: config.graphql.path,
  cors: config.graphql.cors
});

const httpServer = createServer(app);

initNotifications();

httpServer.listen({ port: config.port }, (): void => {
  console.log(
    `\n🚀 Gateway is now running at ${config.url.external} (internal: ${config.host}:${config.port})`
  );
});
