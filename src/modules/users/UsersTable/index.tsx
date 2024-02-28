/* eslint-disable promise/catch-or-return */
/* eslint-disable promise/always-return */
import * as React from 'react';

import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
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
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import RemainigDays from 'components/RemainingDays';
import { User } from 'types';
import {
  sessionsEntry,
  fetchUsers,
  filterByExpirationDate,
} from 'features/users/reducers';
import { setUser, setUsers } from 'features/users';
import { useAppDispatch, useAppSelector } from 'features/store';
import { getAge } from 'utils';
import TableHead from './TableHead';
import UserDetails from '../UserDetails';

export default function UsersTable() {
  const [page, setPage] = React.useState(0);
  const [seachQuery, setSearchQuery] = React.useState('');
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [openUserDetails, setOpenUserDetails] = React.useState(false);

  const { t } = useTranslation();
  const { permission } = useAppSelector((state) => state.authentication);
  const {
    users,
    isLoading,
    user: userDetails,
  } = useAppSelector((state) => state.users);
  const dispatch = useAppDispatch();

  const [filterOption, setFilterOption] = React.useState('all');
  const handleFilterChange = async (event: SelectChangeEvent) => {
    const selectedOption = event.target.value;
    setFilterOption(selectedOption);
    if (selectedOption === 'all') {
      dispatch(fetchUsers(permission));
    } else {
      dispatch(
        filterByExpirationDate({ expireIn: Number(selectedOption), permission })
      );
    }
  };

  const handleSearch = async (e: any) => {
    setSearchQuery(e.target.value);
    const query = e.target.value.toLowerCase().replace(/^0+/, '').trim();

    try {
      const result = await window.electron.searchUsers(query);
      dispatch(setUsers(result));
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
    setOpenUserDetails(true);
    dispatch(setUser(row));
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

  const manualEntry = (id: string) => {
    dispatch(sessionsEntry(id))
      .unwrap()
      .then(
        ({
          isEnteredThreeHoursAgo,
          isMaxSessionsSpent,
          isSubscriptionExpired,
          message,
        }) => {
          if (
            isEnteredThreeHoursAgo ||
            isMaxSessionsSpent ||
            isSubscriptionExpired
          ) {
            toast.error(t(message));
          } else {
            toast.success(t(message));
          }
          return null;
        }
      )
      .catch((err) => toast.error(err));
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
    if (permission) {
      dispatch(fetchUsers(permission));
    }
  }, [permission, dispatch]);

  if (isLoading) return <p>is loading...</p>;

  return (
    <Card variant="outlined" sx={{ width: '100%', mb: 2 }}>
      <div>
        <Stack direction="row" spacing={2} p={2}>
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
          <FormControl sx={{ width: 200 }}>
            <InputLabel id="demo-simple-select-label">filter</InputLabel>
            <Select
              size="small"
              value={filterOption}
              label="filter"
              onChange={handleFilterChange}
            >
              <MenuItem value="all">{t('subscriptions.all')}</MenuItem>
              <MenuItem value={7}>{t('subscriptions.expireIn7Days')}</MenuItem>
              <MenuItem value={3}>{t('subscriptions.expireIn3Days')}</MenuItem>
              <MenuItem value={1}>{t('subscriptions.expireIn1Day')}</MenuItem>
              <MenuItem value={0}>{t('subscriptions.expired')}</MenuItem>
            </Select>
          </FormControl>
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
                      <Avatar sx={{ backgroundColor: 'info.main' }}>
                        {row.photo ? (
                          <img
                            src={row.photo as string}
                            width="100%"
                            alt={row.firstName}
                          />
                        ) : (
                          row.firstName.charAt(0).toUpperCase()
                        )}
                      </Avatar>
                    </TableCell>
                    <TableCell align="left">{row.id}</TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    >
                      {`${row.firstName} ${row.lastName}`}
                    </TableCell>

                    <TableCell align="right">{getAge(row.birthDate)}</TableCell>
                    <TableCell align="right">{row.phoneNumber}</TableCell>
                    <TableCell align="right">{row.registeredAt}</TableCell>
                    <TableCell align="right">
                      {row.subscriptions?.length > 1 ? (
                        <>
                          {row.subscriptions?.map(
                            (sub, i) =>
                              i < 1 && (
                                <RemainigDays key={sub.id} date={sub.endsAt} />
                              )
                          )}
                          <Chip
                            variant="outlined"
                            size="small"
                            label={`& ${row.subscriptions.length - 1} ${t(
                              'info.more'
                            )}..`}
                          />
                        </>
                      ) : (
                        row?.subscriptions?.map((sub) => (
                          <RemainigDays key={sub.id} date={sub.endsAt} />
                        ))
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          manualEntry(row.id);
                        }}
                      >
                        {t('actions.manualEntry')}
                      </Button>
                      <IconButton onClick={(e) => handleEdit(e, row)}>
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow>
                  <TableCell colSpan={8} />
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
            width: '70%',
            p: 5,
            backgroundColor: 'background.default',
            overflowY: 'auto',
          },
        }}
        open={!!userDetails && openUserDetails}
        onClose={() => {
          dispatch(setUser(null));
          setOpenUserDetails(false);
        }}
      >
        {userDetails && <UserDetails manualEntry={manualEntry} />}
      </Drawer>
    </Card>
  );
}
