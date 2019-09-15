import React from "react";
import { Route } from "react-router-dom";
import loadable from "@loadable/component";

const Home = loadable(() => import("./home"));
const Page1 = loadable(() => import("./page1"));

const App = () => (
  <>
    <div>Header</div>
    <Route path="/" exact component={Home} />
    <Route path="/page1" component={Page1} />
  </>
);

export default App;
