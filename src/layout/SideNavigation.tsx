import React, { useMemo } from 'react';

import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

import PeopleIcon from '@mui/icons-material/People';
import DashboardIcon from '@mui/icons-material/Dashboard';
// import CategoryIcon from '@mui/icons-material/Category';
import SettingsIcon from '@mui/icons-material/Settings';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { useAppSelector, useAppDispatch } from 'features/store';
import { Permission } from 'types';
import { logout } from 'features/authentication';

const routes = [
  {
    label: 'dashboard',
    path: '/',
    icon: <DashboardIcon color="primary" />,
    adminOnly: false,
  },
  {
    label: 'users',
    path: '/users',
    icon: <PeopleIcon color="primary" />,
    adminOnly: false,
  },
  // {
  //   label: 'products',
  //   path: '/products',
  //   icon: <CategoryIcon color="inherit" />,
  //   adminOnly: false,
  // },
  {
    label: 'settings',
    path: '/settings',
    icon: <SettingsIcon color="primary" />,
    adminOnly: false,
  },
  {
    label: 'report',
    path: '/report',
    icon: <AssessmentIcon color="primary" />,
    adminOnly: true,
  },
  {
    label: 'administration',
    path: '/administration',
    icon: <AdminPanelSettingsIcon color="primary" />,
    adminOnly: true,
  },
];

export default function SideNavigation() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const { permission } = useAppSelector((state) => state.authentication);
  const dispatch = useAppDispatch();

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
    <List
      sx={{ pt: 0, display: 'flex', flexDirection: 'column', height: '100%' }}
    >
      {permittedRoutes.map((route) => (
        <ListItem key={route.path} disablePadding>
          <ListItemButton
            onClick={handleClick(route.path)}
            selected={pathname === route.path}
            disabled={route.label === 'products'}
          >
            <ListItemIcon>{route.icon}</ListItemIcon>
            <ListItemText
              primary={
                <Typography variant="button" textTransform="none">
                  {t(`common.${route.label}`)}
                </Typography>
              }
            />
          </ListItemButton>
        </ListItem>
      ))}
      <ListItem sx={{ flex: 1 }} />
      <Divider />
      <ListItem disablePadding onClick={() => dispatch(logout())}>
        <ListItemButton>
          <ListItemIcon>
            <PowerSettingsNewIcon color="error" />
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography variant="button" textTransform="none">
                {t('actions.logout')}
              </Typography>
            }
          />
        </ListItemButton>
      </ListItem>
    </List>
  );
}
