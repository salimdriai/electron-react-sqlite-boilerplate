import * as React from 'react';

import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import { User } from 'types';
import { useAppSelector } from 'features/store';
import UserDetails from 'modules/users/UserDetails';
import TableHead from './TableHead';

export default function UsersTable({
  latestEnteredUsers,
}: {
  latestEnteredUsers: User[];
}) {
  const [page, setPage] = React.useState(0);
  const [seachQuery, setSearchQuery] = React.useState('');
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [users, setUsers] = React.useState<User[]>([]);
  const [usersDetails, setUsersDetails] = React.useState<User | null>(null);
  const { t } = useTranslation();

  const { permission } = useAppSelector((state) => state.authentication);

  const handleSearch = async (e: any) => {
    setSearchQuery(e.target.value);
    const query = e.target.value.toLowerCase();
    try {
      const result = await window.electron.searchUsers(query);
      setUsers(result);
    } catch (error) {
      console.error('ERRR', error);
    }
  };

  const handleClearSearch = async () => {
    setSearchQuery('');
    const data = await window.electron.getAllUsers(permission);
    setUsers(data);
  };

  const handleClick = (event: React.MouseEvent<unknown>, row: User) => {
    setUsersDetails(row);
  };

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
  const navigate = useNavigate();

  const handleEdit = (e: any, row: any) => {
    e.stopPropagation();
    navigate('/users/add', { state: row });
  };

  React.useEffect(() => {
    setUsers(latestEnteredUsers);
  }, [permission, latestEnteredUsers]);

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
            {t('user.latestEntries')}
          </Typography>
          <TextField
            onChange={handleSearch}
            value={seachQuery}
            variant="outlined"
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {!seachQuery ? (
                    <SearchIcon />
                  ) : (
                    <CloseIcon
                      sx={{ cursor: 'pointer' }}
                      onClick={handleClearSearch}
                    />
                  )}
                </InputAdornment>
              ),
            }}
          />
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
                    onClick={(event) => handleClick(event, row)}
                    role="checkbox"
                    tabIndex={-1}
                    key={row.id}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell>
                      <Avatar sx={{ backgroundColor: 'secondary.main' }}>
                        {row.photo ? (
                          <img
                            // @ts-ignore
                            src={row.photo}
                            width="100%"
                            alt={row.firstName}
                          />
                        ) : (
                          row.firstName.charAt(0).toUpperCase()
                        )}
                      </Avatar>
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    >
                      {`${row.firstName} ${row.lastName}`}
                    </TableCell>
                    <TableCell align="left">{row.id}</TableCell>

                    <TableCell align="right">{row.phoneNumber}</TableCell>
                    <TableCell align="right">{row.registeredAt}</TableCell>
                    <TableCell align="right">
                      {/* <UserStatus status={row.status} /> */}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton onClick={(e) => handleEdit(e, row)}>
                        <EditIcon />
                      </IconButton>
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
            {t('common.nothingToShow')}
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
        <UserDetails userId={usersDetails?.id as string} />
      </Drawer>
    </Card>
  );
}
