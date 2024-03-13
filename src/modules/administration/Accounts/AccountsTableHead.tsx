import React from 'react';

import { useTranslation } from 'react-i18next';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

interface Data {
  id: string;
  username: string;
  permission: string;
  role: string;
  phoneNumber: number;
  createdAt: any;
  actions: any;
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: 'username',
    numeric: false,
    disablePadding: true,
    label: 'username',
  },
  {
    id: 'phoneNumber',
    numeric: false,
    disablePadding: false,
    label: 'phoneNumber',
  },
  {
    id: 'createdAt',
    numeric: true,
    disablePadding: false,
    label: 'createdAt',
  },
  {
    id: 'permission',
    numeric: true,
    disablePadding: false,
    label: 'permission',
  },
  {
    id: 'role',
    numeric: true,
    disablePadding: false,
    label: 'role',
  },
  {
    id: 'actions',
    numeric: true,
    disablePadding: false,
    label: 'actions',
  },
];

export default function EnhancedTableHead() {
  const { t } = useTranslation();

  return (
    <TableHead>
      <TableRow>
        <TableCell />
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
          >
            {t(`user.${headCell.label}`)}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
