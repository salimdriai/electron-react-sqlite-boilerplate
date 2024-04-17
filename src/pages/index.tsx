import React, { useEffect } from 'react';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { Permission } from 'types';
import SidebarLayout from '../layout';
import LoginPage from './login';
import DashboardPage from './dashboard';
import UsersPage from './users';
import UserPage from './users/user';
import AddUserPage from './users/add-user';
import ProductsPage from './products';
import ProductPage from './products/product';
import AddProductPage from './products/add-product';
import SettingsPage from './settings';
import AdministrationPage from './administration';
import ReportPage from './report';
import { useAppSelector } from '../features/store';
import ActivationPage from './activation';

const privateRoutes = [
  {
    path: '/',
    element: <DashboardPage />,
    adminOnly: false,
  },
  {
    path: '/users',
    element: <UsersPage />,
    adminOnly: false,
  },
  {
    path: '/users/:id',
    element: <UserPage />,
    adminOnly: false,
  },
  {
    path: '/users/add',
    element: <AddUserPage />,
    adminOnly: false,
  },
  {
    path: '/products',
    element: <ProductsPage />,
    adminOnly: false,
  },
  {
    path: '/products/:id',
    element: <ProductPage />,
    adminOnly: false,
  },
  {
    path: '/products/add',
    element: <AddProductPage />,
    adminOnly: false,
  },
  {
    path: '/settings',
    element: <SettingsPage />,
    adminOnly: false,
  },
  {
    path: '/administration',
    element: <AdministrationPage />,
    adminOnly: true,
  },
  {
    path: '/report',
    element: <ReportPage />,
    adminOnly: true,
  },
  {
    path: '/activation',
    element: <ActivationPage />,
    adminOnly: true,
    isFullScreen: true,
  },
];

export default function Pages() {
  const { isAuthneticated, permission } = useAppSelector(
    ({ authentication }) => authentication
  );

  const { pathname } = useLocation();

  useEffect(() => {
    const entryInput = document.getElementById('entry-input');
    entryInput?.focus();
  }, [pathname]);

  if (pathname === '/activation') {
    return <ActivationPage />;
  }
  if (!isAuthneticated) {
    return <LoginPage />;
  }

  return (
    <Routes>
      {privateRoutes.map((page) => {
        if (permission !== Permission.Admin && page.adminOnly) {
          return (
            <Route
              key={page.path}
              path={page.path}
              element={<Navigate to="/" />}
            />
          );
        }
        return (
          <Route
            key={page.path}
            path={page.path}
            element={<SidebarLayout page={page.element} />}
          />
        );
      })}
    </Routes>
  );
}
