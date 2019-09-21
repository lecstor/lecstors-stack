import React from "react";
import { useMutation } from "urql";

import { Button, ButtonLayout } from "@lecstor/react-ui";

import { deleteUser } from "./queries";

const Profile = () => {
  const [res, executeMutation] = useMutation(deleteUser);

  const onClick = () => executeMutation();

  return (
    <>
      <h1>Profile</h1>
      {res.error && res.error.message}
      {res.error && JSON.stringify(res.error)}
      <ButtonLayout>
        <Button mode="" onClick={onClick}>
          Delete Profile
        </Button>
      </ButtonLayout>
    </>
  );
};
export default Profile;
