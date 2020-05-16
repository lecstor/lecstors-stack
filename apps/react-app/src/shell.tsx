import { hot } from "react-hot-loader/root";
import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import loadable from "@loadable/component";

import { ThemeProvider, GlobalStyle } from "@lecstor/react-ui";

import { Provider as UrqlProvider, createClient } from "./lib/gql-client";

import AuthProvider from "./auth/provider";
import AuthGateway from "./auth/gateway";

const Login = loadable(() => import("./auth/login"));
const Register = loadable(() => import("./auth/register"));
const VerifyEmail = loadable(() => import("./auth/verify-email"));

const App = loadable(() => import("./app"));

const client = createClient();

const Shell = () => (
  <>
    <GlobalStyle />
    <ThemeProvider>
      <BrowserRouter>
        <UrqlProvider value={client}>
          <AuthProvider>
            <Switch>
              <Route path="/verify-email/:token" component={VerifyEmail} />
              <Route>
                <AuthGateway>
                  <Switch>
                    <Route path="/a/login" component={Login} />
                    <Route path="/a/register" component={Register} />
                    <Route path="/" component={App} />
                  </Switch>
                </AuthGateway>
              </Route>
            </Switch>
          </AuthProvider>
        </UrqlProvider>
      </BrowserRouter>
    </ThemeProvider>
  </>
);

export default hot(Shell);
