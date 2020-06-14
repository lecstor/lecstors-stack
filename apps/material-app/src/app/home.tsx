import React from "react";
import styled from "styled-components";

import usePageTitle from "../hooks/usePageTitle";

const H1 = styled.h1``;

const Home = () => {
  usePageTitle("Home");

  return (
    <>
      <H1>Home</H1>
    </>
  );
};

export default Home;
