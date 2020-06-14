import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

import { useAuth, useVerifyEmail } from "./hooks";

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
    <Box p="2">
      <Typography variant="h3" component="h1" gutterBottom>
        Verify Email
      </Typography>
      <Box padding="2rem 1rem 1rem">
        <Link data-testid="link-home" to="/">
          Home
        </Link>
        <div data-testid="is-verified">verified: {verified ? "yes" : "no"}</div>
        <div>{auth?.user?.firstname}</div>
      </Box>
    </Box>
  );
};

export default VerifyEmail;
