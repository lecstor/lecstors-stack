import { hot } from "react-hot-loader/root";
import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import loadable from "@loadable/component";

import { ThemeProvider, GlobalStyle } from "@lecstor/react-ui";

import { Provider, createClient } from "./lib/gql-client";
import { schemaExchange } from "urql-exchange-schema";

import { AuthProvider } from "./auth/context";

import newMockSchema from "./lib/mock-schema";

// import { createGlobalStyle } from "styled-components";

// const GlobalStyle = createGlobalStyle`
//   html {
//     font-size: 10px;
//   }
//   body {
//     font-size: 1.6rem;
//     font-family: 'Open Sans', sans-serif;
//   }
// `;

const Login = loadable(() => import("./auth/login"));
const Register = loadable(() => import("./auth/register"));

const App = loadable(() => import("./app"));

const client = createClient();

const Shell = () => (
  <>
    <GlobalStyle />
    <ThemeProvider>
      <BrowserRouter>
        <Provider value={client}>
          <GlobalStyle />
          <AuthProvider>
            <Switch>
              <Route path="/p/login" component={Login} />
              <Route path="/p/register" component={Register} />
              <Route path="/" component={App} />
            </Switch>
          </AuthProvider>
        </Provider>
      </BrowserRouter>
    </ThemeProvider>
  </>
);

export default hot(Shell);
