import React from 'react';

import { useTranslation } from 'react-i18next';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

interface Data {
  fullName: string;
  id: string;
  phoneNumber: number;
  subscriptions: any;
  status: string;
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: 'fullName',
    numeric: false,
    disablePadding: true,
    label: 'name',
  },
  {
    id: 'id',
    numeric: false,
    disablePadding: false,
    label: 'id',
  },
  {
    id: 'phoneNumber',
    numeric: true,
    disablePadding: false,
    label: 'phoneNumber',
  },
  {
    id: 'subscriptions',
    numeric: true,
    disablePadding: false,
    label: 'subscriptions',
  },
  {
    id: 'status',
    numeric: true,
    disablePadding: false,
    label: 'status',
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
