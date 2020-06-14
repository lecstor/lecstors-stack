import React from "react";
import styled from "styled-components";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

import { useAuth } from "../../auth/hooks";
import usePageTitle from "../../hooks/usePageTitle";

import ProfileMenu from "./profileMenu";
import MainMenu from "./mainMenu";

const Root = styled.div`
  flex-grow: 1;
`;

const Title = styled(Typography).attrs({ variant: "h6" })`
  flex-grow: 1;
`;

const UserName = styled(Typography).attrs({
  component: "span",
  fontSize: "1.2rem"
})``;

const NavBar = () => {
  const { auth } = useAuth();
  const [title] = usePageTitle();

  return (
    <Root>
      <AppBar position="static">
        <Toolbar>
          <MainMenu />
          <Title variant="h6">{title}</Title>
          {auth && (
            <div>
              <UserName>
                {auth.user.firstname} {auth.user.surname}
              </UserName>
              <ProfileMenu />
            </div>
          )}
        </Toolbar>
      </AppBar>
    </Root>
  );
};

export default NavBar;
