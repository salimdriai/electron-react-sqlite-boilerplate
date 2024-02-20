import React from 'react';

import { useTranslation } from 'react-i18next';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

interface Data {
  id: string;
  fullName: string;
  age: string;
  phoneNumber: number;
  registredAt: any;
  status: string;
  actions: string;
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: 'id',
    numeric: false,
    disablePadding: false,
    label: 'id',
  },
  {
    id: 'fullName',
    numeric: false,
    disablePadding: true,
    label: 'name',
  },
  {
    id: 'age',
    numeric: true,
    disablePadding: true,
    label: 'age',
  },
  {
    id: 'phoneNumber',
    numeric: true,
    disablePadding: false,
    label: 'phoneNumber',
  },
  {
    id: 'registredAt',
    numeric: true,
    disablePadding: false,
    label: 'registredAt',
  },
  {
    id: 'status',
    numeric: true,
    disablePadding: false,
    label: 'status',
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
