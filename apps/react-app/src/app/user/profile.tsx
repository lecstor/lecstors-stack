import React from "react";
import { useQuery } from "urql";

import { Button, ButtonLayout } from "@lecstor/react-ui";

import useDeleteAccount from "../../auth/hooks/use-delete-account";
import useLogOut from "../../auth/hooks/use-log-out";
import { currentUser } from "./queries";

const Profile = () => {
  const apiDeleteAccount = useDeleteAccount();
  const apiLogOut = useLogOut();

  const [userRes] = useQuery({ query: currentUser });

  const deleteOnClick = () => apiDeleteAccount();
  const logoutOnClick = () => apiLogOut();

  if (userRes.fetching) return null;

  return (
    <>
      <h1>Profile</h1>
      <pre>{JSON.stringify(userRes, null, 2)}</pre>
      <ButtonLayout>
        <Button onClick={deleteOnClick}>Delete Account</Button>
      </ButtonLayout>
      <ButtonLayout>
        <Button onClick={logoutOnClick}>Log Out</Button>
      </ButtonLayout>
    </>
  );
};

export default Profile;
