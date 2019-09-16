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

import cors from "cors";

import sessionStore from "./express-session-store";
import passport from "./passport";
import schema from "./graphql/schema";
import { getContext } from "./graphql/context";

const app = express();
const isProd = app.get("env") === "production";

const sessionOptions: SessionOptions = {
  store: new (sessionStore(session))(),
  genid: () => uuid(),
  secret: "cnjdubvksmfgsdfvfvdfgw",
  cookie: {
    secure: isProd,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    httpOnly: true
  },
  resave: false,
  saveUninitialized: false
};

if (isProd) {
  app.set("trust proxy", 1); // trust first proxy
}
app.use(morgan("combined"));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session(sessionOptions));
app.use(
  "*",
  cors({
    origin: ["http://localhost:4321", "http://localhost:3000"],
    credentials: true
  })
);
app.use(compression());
app.use(passport.initialize());
app.use(passport.session());

const server = new ApolloServer({
  schema,
  debug: !isProd,
  // validationRules: [depthLimit(7)],
  // context: ({ req }: { req: Request }): { req: Request } => ({ req }),
  context: getContext

  // formatError: err => {
  //   if (err.originalError && (err.originalError as any).public) {
  //     const gqlErr: OkError = err.originalError;
  //     console.log(`${gqlErr.name}: ${gqlErr.message}`);
  //     return {
  //       message: gqlErr.message,
  //       extensions: {
  //         code: gqlErr.name,
  //         data: gqlErr.data
  //       }
  //     };
  //   }
  //   const {
  //     message,
  //     path,
  //     extensions: {
  //       code,
  //       exception: { stacktrace }
  //     }
  //   } = err;
  //   console.log(
  //     `${code}\n  ${message}\n  GQL Path: ${path}\n  ${stacktrace.join("\n")}`
  //   );

  //   return new Error("Internal server error");
  // }
});
server.applyMiddleware({ app, path: "/graphql", cors: false });

const httpServer = createServer(app);

httpServer.listen({ port: 3000 }, (): void =>
  console.log(
    `\n🚀      GraphQL is now running on http://localhost:3000/graphql`
  )
);
