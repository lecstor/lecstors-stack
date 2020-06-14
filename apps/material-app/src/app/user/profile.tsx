import React from "react";
import { useQuery } from "urql";

import { useDeleteAccount } from "../../auth/hooks";
import usePageTitle from "../../hooks/usePageTitle";
import Button from "../../components/button";
import { currentUser } from "./queries";

const Profile = () => {
  usePageTitle("Profile");

  const apiUnregister = useDeleteAccount();

  const [userRes] = useQuery({ query: currentUser });

  const deleteOnClick = () => apiUnregister();

  if (userRes.fetching) return null;

  return (
    <>
      <h1>Profile</h1>
      <pre>{JSON.stringify(userRes, null, 2)}</pre>
      <Button color="warning" onClick={deleteOnClick}>
        Delete Account
      </Button>
    </>
  );
};

export default Profile;
