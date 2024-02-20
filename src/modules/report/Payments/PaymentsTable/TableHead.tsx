import React from 'react';

import { useTranslation } from 'react-i18next';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

interface Data {
  fullName: string;
  userId: string;
  amount: number;
  paidAt: string;
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: 'userId',
    numeric: false,
    disablePadding: false,
    label: 'userId',
  },
  {
    id: 'fullName',
    numeric: false,
    disablePadding: true,
    label: 'name',
  },
  {
    id: 'amount',
    numeric: true,
    disablePadding: false,
    label: 'amount',
  },
  {
    id: 'paidAt',
    numeric: true,
    disablePadding: false,
    label: 'paidAt',
  },
];

export default function EnhancedTableHead() {
  const { t } = useTranslation();

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
          >
            {t(`payments.${headCell.label}`)}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
