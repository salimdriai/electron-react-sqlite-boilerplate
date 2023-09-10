import * as React from 'react';
import { useAppSelector } from 'features/store';
import { Permission } from 'types';

export interface IAppProps {
  children: React.ReactElement;
}

export function AdminGuard(props: IAppProps) {
  const { children } = props;
  const { permission } = useAppSelector((state) => state.authentication);

  if (permission !== Permission.Admin) return null;
  return children;
}
