import * as React from 'react';

import { useTranslation } from 'react-i18next';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { FreeSession } from 'types';
import { useAppSelector } from 'features/store';
import TableHead from './TableHead';

export default function SessionsTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [freeSessions, setFreeSessions] = React.useState<FreeSession[]>([]);
  const { t } = useTranslation();

  const { permission } = useAppSelector((state) => state.authentication);

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
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - freeSessions.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      freeSessions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [page, rowsPerPage, freeSessions]
  );

  React.useEffect(() => {
    const getFreeSessions = async () => {
      const data = await window.electron.getFreeSessions();
      setFreeSessions(data);
    };
    getFreeSessions();
  }, [permission]);

  return (
    <Card variant="outlined" sx={{ width: '100%', mb: 2 }}>
      <div>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          p={2}
        >
          <Typography color="primary" variant="h6">
            {' '}
            {t('common.freeSessionsLatest')}
          </Typography>
        </Stack>

        <TableContainer>
          <Table sx={{ minWidth: 350 }} aria-labelledby="tableTitle">
            <TableHead />
            <TableBody>
              {visibleRows.map((row) => {
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={row.enteredAt}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell align="left">
                      {row.enteredAt.split('T').join(' ').split('.')[0]}
                    </TableCell>

                    <TableCell align="left">{row.totalPaid}</TableCell>
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
          count={freeSessions.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage={t('common.rowsPerPage')}
        />
      </div>
    </Card>
  );
}
