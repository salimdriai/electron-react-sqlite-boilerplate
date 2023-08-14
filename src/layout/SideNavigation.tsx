import React, { useMemo } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

import PeopleIcon from '@mui/icons-material/People';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CategoryIcon from '@mui/icons-material/Category';
import SettingsIcon from '@mui/icons-material/Settings';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { useAppSelector } from 'features/store';
import { Permission } from 'types';

const routes = [
  { label: 'dashboard', path: '/', icon: <DashboardIcon />, adminOnly: false },
  { label: 'users', path: '/users', icon: <PeopleIcon />, adminOnly: false },
  {
    label: 'products',
    path: '/products',
    icon: <CategoryIcon />,
    adminOnly: false,
  },
  {
    label: 'settings',
    path: '/settings',
    icon: <SettingsIcon />,
    adminOnly: true,
  },
  {
    label: 'administration',
    path: '/administration',
    icon: <AdminPanelSettingsIcon />,
    adminOnly: true,
  },
];

export default function SideNavigation() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { permission } = useAppSelector((state) => state.authentication);

  const permittedRoutes = useMemo(() => {
    if (permission === Permission.Admin) {
      return routes;
    }
    return routes.filter((route) => !route.adminOnly);
  }, [permission]);

  const handleClick = (path: string) => () => {
    navigate(path);
  };

  return (
    <List sx={{ pt: 0 }}>
      {permittedRoutes.map((route) => (
        <ListItem
          key={route.path}
          disablePadding
          onClick={handleClick(route.path)}
        >
          <ListItemButton selected={pathname === route.path}>
            <ListItemIcon>{route.icon}</ListItemIcon>
            <ListItemText
              primary={
                <Typography variant="button" textTransform="none">
                  {route.label}
                </Typography>
              }
            />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
}
