import React from "react";
import { Link as RRLink } from "react-router-dom";
import styled from "styled-components";

import { Layout, textCss } from "@lecstor/react-ui";

import useAuth from "../auth/hooks/use-auth";
import useLogOut from "../auth/hooks/use-log-out";

// import { Lorem } from "@lecstor/react-ui";

const H1 = styled.h1``;

const Link = styled(RRLink)`
  ${({ theme }) => textCss({ theme })}
  padding: 1rem;
`;

const Home = () => {
  const { auth } = useAuth();
  const logOut = useLogOut();

  return (
    <>
      <H1>Home</H1>
      <h2>Hi {auth.user.firstname}</h2>
      <Layout mode="hamburger">
        <Link to="/" onClick={logOut}>
          Log Out
        </Link>
        <Link to="/profile">Profile</Link>
        <Link to="/set-credentials">Set Credentials</Link>
      </Layout>
      {/* <Lorem /> */}
    </>
  );
};

export default Home;
