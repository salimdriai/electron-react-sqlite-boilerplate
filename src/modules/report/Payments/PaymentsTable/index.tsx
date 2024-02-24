import * as React from 'react';

import { useTranslation } from 'react-i18next';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import { Payment } from 'types';
import TableHead from './TableHead';

const PaymentsTable = ({ payments }: { payments: Payment[] }) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const { t } = useTranslation();

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - payments.length) : 0;

  const visibleRows = React.useMemo(
    () => payments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [page, rowsPerPage, payments]
  );

  return (
    <Card variant="outlined" sx={{ width: '100%', mb: 2, flex: 5 }}>
      <div>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          p={2}
        >
          <Typography variant="h6" color="primary">
            {' '}
            {t('payments.history')}
          </Typography>
        </Stack>
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
            <TableHead />
            <TableBody>
              {visibleRows.map((row, index) => {
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={row.id}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell align="left">{row.userId}</TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    >
                      {row.username}
                    </TableCell>

                    <TableCell align="right">{row.amount}</TableCell>
                    <TableCell align="right">{row.paidAt}</TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {visibleRows.length === 0 && (
          <Typography color="text.secondary" sx={{ my: 20 }} align="center">
            {t('common.nothingToShow')}
          </Typography>
        )}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={payments.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage={t('common.rowsPerPage')}
        />
      </div>
    </Card>
  );
};

export default PaymentsTable;
