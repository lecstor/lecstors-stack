import React from "react";
import { Route } from "react-router-dom";
import loadable from "@loadable/component";

const Home = loadable(() => import("./home"));
const Profile = loadable(() => import("./user/profile"));

const App = () => (
  <>
    <div>Header</div>
    <Route path="/" exact component={Home} />
    <Route path="/profile" component={Profile} />
  </>
);

export default App;
