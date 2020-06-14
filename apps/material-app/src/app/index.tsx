import React from "react";
import { Route } from "react-router-dom";
import loadable from "@loadable/component";

import Box from "@material-ui/core/Box";

import NavBar from "./nav-bar";

const Home = loadable(() => import("./home"));
const Teams = loadable(() => import("./teams"));
const Profile = loadable(() => import("./user/profile"));
const SetCredentials = loadable(() => import("./user/setCredentials"));

const App = () => {
  return (
    <>
      <NavBar />
      <Box p={1}>
        <Route path="/" exact>
          <Home />
        </Route>
        <Route path="/profile">
          <Profile />
        </Route>
        <Route path="/teams">
          <Teams />
        </Route>
        <Route path="/set-credentials">
          <SetCredentials />
        </Route>
      </Box>
    </>
  );
};

export default App;
