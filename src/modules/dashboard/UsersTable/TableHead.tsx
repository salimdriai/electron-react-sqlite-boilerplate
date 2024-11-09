import React from 'react';

import { useTranslation } from 'react-i18next';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

interface Data {
  fullName: string;
  id: string;
  phoneNumber: number;
  enteredAt: any;
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
    id: 'fullName',
    numeric: false,
    disablePadding: true,
    label: 'name',
  },
  {
    id: 'enteredAt',
    numeric: true,
    disablePadding: false,
    label: 'enteredAt',
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
