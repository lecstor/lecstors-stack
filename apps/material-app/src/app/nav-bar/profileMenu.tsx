import React, { ReactEventHandler } from "react";
import { Link as RRLink } from "react-router-dom";

import AccountCircle from "@material-ui/icons/AccountCircle";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

import { useLogOut } from "../../auth/hooks";

const ProfileMenu = () => {
  const logOut = useLogOut();
  const [anchorEl, setAnchorEl] = React.useState<
    (EventTarget & Element) | null
  >(null);
  const open = Boolean(anchorEl);

  const handleMenu: ReactEventHandler = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        aria-label="account menu"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleMenu}
        color="inherit"
      >
        <AccountCircle />
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={open}
        onClose={handleClose}
      >
        <li>
          <MenuItem component={RRLink} to="/profile" onClick={handleClose}>
            Profile
          </MenuItem>
        </li>

        <li>
          <MenuItem
            component={RRLink}
            to="/set-credentials"
            onClick={handleClose}
          >
            Set Credentials
          </MenuItem>
        </li>

        <MenuItem onClick={logOut}>Log Out</MenuItem>
      </Menu>
    </>
  );
};

export default ProfileMenu;
