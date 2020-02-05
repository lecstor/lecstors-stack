import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

import { Body, Heading, Layout } from "@lecstor/react-ui";

import useAuth from "./hooks/use-auth";

import useVerifyEmail from "./hooks/use-verify-email";

const VerifyEmail = () => {
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);
  const { token } = useParams();
  const verifyEmail = useVerifyEmail();
  const { auth } = useAuth();

  useEffect(() => {
    verifyEmail(token).then(res => {
      if (res?.error) {
        setError(error);
      } else {
        setVerified(true);
      }
    });
  }, []);

  return (
    <Layout pad="1">
      <Heading>Verify Email</Heading>
      <Layout pad="2 1 1">
        <Body>
          <Link data-testid="link-home" to="/">
            Home
          </Link>
          <div data-testid="is-verified">
            verified: {verified ? "yes" : "no"}
          </div>
          <div>{auth?.user?.firstname}</div>
        </Body>
      </Layout>
    </Layout>
  );
};
export default VerifyEmail;
