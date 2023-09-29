import * as React from 'react';

import { useTranslation } from 'react-i18next';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';

import { FreeSession, User } from 'types';
import { useAppSelector } from 'features/store';
import UserDetails from 'modules/users/UserDetails';
import TableHead from './TableHead';

const colors = ['info', 'primary', 'secondary'];

export default function UsersTable({
  latestFreeSessions,
}: {
  latestFreeSessions: FreeSession[];
}) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [users, setUsers] = React.useState<FreeSession[]>([]);
  const [usersDetails, setUsersDetails] = React.useState<User | null>(null);
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
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - users.length) : 0;

  const visibleRows = React.useMemo(
    () => users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [page, rowsPerPage, users]
  );

  React.useEffect(() => {
    setUsers(latestFreeSessions);
  }, [permission, latestFreeSessions]);

  return (
    <Card variant="outlined" sx={{ width: '100%', mb: 2 }}>
      <div>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          py={2}
          px={2}
        >
          <Typography variant="h6">
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
                    <TableCell align="left">{row.enteredAt}</TableCell>

                    <TableCell align="left">{row.totalPaid}</TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="end">
                        {row.sessionType.map((type, i) => (
                          <Chip
                            key={type.name}
                            size="small"
                            label={type.name}
                            // @ts-ignore
                            color={colors[i] as string}
                          />
                        ))}
                      </Stack>
                    </TableCell>
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
            No users to show
          </Typography>
        )}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={users.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage={t('common.rowsPerPage')}
        />
      </div>
      <Drawer
        anchor="right"
        sx={{
          '& > .MuiPaper-root': {
            width: '50%',
            p: 5,
            backgroundColor: 'background.default',
          },
        }}
        open={!!usersDetails}
        onClose={() => setUsersDetails(null)}
      >
        <UserDetails user={usersDetails as User} />
      </Drawer>
    </Card>
  );
}
