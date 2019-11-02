import React from "react";
import { useMutation, useQuery } from "urql";

import { Button, ButtonLayout } from "@lecstor/react-ui";

import { deleteUser, logoutUser } from "../../auth/queries";
import { currentUser, verifyEmail } from "./queries";

const Profile = () => {
  const [userRes] = useQuery({ query: currentUser });
  const [deleteRes, deleteUserMutation] = useMutation(deleteUser);
  const [logoutRes, logoutUserMutation] = useMutation(logoutUser);
  const [verifyRes, verifyMutation] = useMutation(verifyEmail);

  const deleteOnClick = () => deleteUserMutation();
  const logoutOnClick = () => logoutUserMutation();
  const verifyOnClick = () =>
    verifyMutation({
      token: userRes.data.currentUser.emails[0].verificationTokens[0].id
    });

  if (userRes.fetching) return null;

  return (
    <>
      <h1>Profile</h1>
      <pre>{JSON.stringify(userRes, null, 2)}</pre>
      {deleteRes.error && deleteRes.error.message}
      {logoutRes.error && logoutRes.error.message}
      {verifyRes.error && verifyRes.error.message}
      <ButtonLayout>
        <Button mode="" onClick={verifyOnClick}>
          Verify Email
        </Button>
      </ButtonLayout>
      <ButtonLayout>
        <Button mode="" onClick={deleteOnClick}>
          Delete Profile
        </Button>
      </ButtonLayout>
      <ButtonLayout>
        <Button mode="" onClick={logoutOnClick}>
          Log Out
        </Button>
      </ButtonLayout>
    </>
  );
};

export default Profile;
