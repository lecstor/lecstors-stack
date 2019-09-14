import { hot } from "react-hot-loader/root";
import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import loadable from "@loadable/component";
import { Provider, createClient } from "urql";
import { schemaExchange } from "urql-exchange-schema";

import { AuthProvider } from "./auth/context";

import newMockSchema from "./lib/mock-schema";

import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  html {
    font-size: 10px;
  }
  body {
    font-size: 1.6rem;
    font-family: 'Open Sans', sans-serif;
  }
`;

const Login = loadable(() => import("./auth/login"));
const App = loadable(() => import("./app"));

const client = createClient({
  url: "http://localhost:3000/graphql",
  // exchanges: [schemaExchange(newMockSchema())]
  fetchOptions: {
    mode: "cors", // no-cors, cors, *same-origin
    // credentials: "same-origin"
    credentials: "include"
  }
});

const Shell = () => (
  <BrowserRouter>
    <Provider value={client}>
      <GlobalStyle />
      <AuthProvider>
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/" component={App} />
        </Switch>
      </AuthProvider>
    </Provider>
  </BrowserRouter>
);

export default hot(Shell);
