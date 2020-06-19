import { hot } from "react-hot-loader/root";
import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { ThemeProvider } from "styled-components";
// https://material-ui.com/guides/interoperability/#theme

import loadable from "@loadable/component";

import CssBaseline from "@material-ui/core/CssBaseline";
import {
  ThemeProvider as MuiThemeProvider,
  StylesProvider,
} from "@material-ui/core/styles";
// https://material-ui.com/guides/interoperability/#controlling-priority-3

import { Provider as UrqlProvider, createClient } from "./lib/gql-client";

import AuthProvider from "./auth/provider";
import AuthGateway from "./auth/gateway";

import { theme } from "./theme";

const Login = loadable(() => import("./auth/login"));
const Register = loadable(() => import("./auth/register"));
const VerifyEmail = loadable(() => import("./auth/verifyEmail"));

const App = loadable(() => import("./app"));

const client = createClient();

const Root = () => (
  <>
    <CssBaseline />
    <StylesProvider injectFirst>
      <RecoilRoot>
        <MuiThemeProvider theme={theme}>
          <ThemeProvider theme={theme}>
            <BrowserRouter>
              <UrqlProvider value={client}>
                <AuthProvider>
                  <Switch>
                    <Route
                      path="/verify-email/:token"
                      component={VerifyEmail}
                    />
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
        </MuiThemeProvider>
      </RecoilRoot>
    </StylesProvider>
  </>
);

export default hot(Root);
