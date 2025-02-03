import React from "react";
import { Drawer, List, ListItem, ListItemText, ListItemIcon } from "@mui/material";
import PetsIcon from "@mui/icons-material/Pets";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SettingsIcon from "@mui/icons-material/Settings";
import { Link } from "react-router-dom";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <Drawer anchor="left" open={isOpen} onClose={toggleSidebar}>
      <List style={{ width: 250 }}>
        <ListItem>
          <ListItemText primary="Cat Care Dashboard" style={{ fontWeight: "bold" }} />
        </ListItem>

        <ListItem button component={Link} to="/">
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>

        <ListItem button component={Link} to="/cats">
          <ListItemIcon>
            <PetsIcon />
          </ListItemIcon>
          <ListItemText primary="My Cats" />
        </ListItem>

        <ListItem button component={Link} to="/settings">
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
