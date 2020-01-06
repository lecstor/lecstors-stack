import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import useAuth from "../auth/use-auth";

// import { Lorem } from "@lecstor/react-ui";

const H1 = styled.h1``;

const Home = () => {
  const auth = useAuth();
  return (
    <>
      <H1>Home</H1>
      <h2>Hi {auth.user.firstname}</h2>
      <Link to="/login">Login</Link>
      <Link to="/profile">Profile</Link>
      {/* <Lorem /> */}
    </>
  );
};

export default Home;
