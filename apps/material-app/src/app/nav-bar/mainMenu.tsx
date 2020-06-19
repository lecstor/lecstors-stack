import React, { ReactEventHandler } from "react";
import { Link as RRLink } from "react-router-dom";

import IconButton from "@material-ui/core/IconButton";
import Link from "@material-ui/core/Link";
import Menu from "@material-ui/core/Menu";
import MenuIcon from "@material-ui/icons/Menu";
import MenuItem from "@material-ui/core/MenuItem";

const MainMenu = () => {
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
        edge="start"
        color="inherit"
        aria-label="main menu"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleMenu}
      >
        <MenuIcon />
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        keepMounted
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        open={open}
        onClose={handleClose}
      >
        <Link component={RRLink} to="/">
          <MenuItem onClick={handleClose}>Home</MenuItem>
        </Link>
        <Link component={RRLink} to="/teams">
          <MenuItem onClick={handleClose}>Teams</MenuItem>
        </Link>
      </Menu>
    </>
  );
};

export default MainMenu;
