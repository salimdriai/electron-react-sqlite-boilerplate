import React from 'react';

import { useTranslation } from 'react-i18next';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

const headCells = [
  {
    id: 'enteredAt',
    numeric: false,
    disablePadding: true,
    label: 'date',
  },
  {
    id: 'sessionType',
    numeric: false,
    disablePadding: false,
    label: 'type',
  },
  {
    id: 'totalPaid',
    numeric: true,
    disablePadding: false,
    label: 'total paid',
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
            {t(`user.${headCell.label}`)}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
