import * as React from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Avatar from '@mui/material/Avatar';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { User } from 'types';
import UserStatus from 'components/UserStatus';
import TableHead from './TableHead';
import UserDetails from '../UserDetails';

const colors = ['info', 'primary', 'secondary'];

export default function UsersTable() {
  const [page, setPage] = React.useState(0);
  const [seachQuery, setSearchQuery] = React.useState('');
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [users, setUsers] = React.useState<User[]>([]);
  const [usersDetails, setUsersDetails] = React.useState<User | null>(null);

  const handleSearch = async (e: any) => {
    setSearchQuery(e.target.value);
    const query = e.target.value.toLowerCase();
    try {
      const result = await window.electron.searchUsers(query);
      setUsers(result);
    } catch (error) {
      console.log('ERRR', error);
    }
  };

  const handleClearSearch = async () => {
    setSearchQuery('');
    const data = await window.electron.getAllUsers();
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

  React.useEffect(() => {
    const getUsers = async () => {
      const data = await window.electron.getAllUsers();
      setUsers(data);
    };
    getUsers();
  }, []);

  return (
    <Box sx={{ width: '100%' }}>
      <Paper elevation={1} sx={{ width: '100%', mb: 2 }}>
        <Stack direction="row" py={1} px={2}>
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
                      <Avatar>
                        {/* @ts-ignore */}
                        <img src={row.photo} width="100%" alt={row.firstName} />
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
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="end">
                        {row.currentSubscriptions.map(
                          ({ subscription }: any, i: number) => (
                            <Chip
                              key={subscription.name}
                              size="small"
                              label={subscription.name}
                              // @ts-ignore
                              color={colors[i] as string}
                            />
                          )
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell align="right">
                      <UserStatus status={row.status} />
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
        />
      </Paper>
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
    </Box>
  );
}