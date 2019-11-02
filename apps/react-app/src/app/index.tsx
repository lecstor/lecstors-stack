import React from "react";
import { Route } from "react-router-dom";
import loadable from "@loadable/component";

const Home = loadable(() => import("./home"));
const Profile = loadable(() => import("./user/profile"));
const Tokens = loadable(() => import("../auth/tokens"));

const App = () => (
  <>
    <div>Header</div>
    <Route path="/" exact component={Home} />
    <Route path="/profile" component={Profile} />
    <Route path="/tokens" component={Tokens} />
  </>
);

export default App;
