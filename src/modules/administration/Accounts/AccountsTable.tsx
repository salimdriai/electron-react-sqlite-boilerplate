import * as React from 'react';

import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Account } from 'types';
import { useAppSelector } from 'features/store';
import TableHead from './AccountsTableHead';

export default function AccountsTable({
  setEditAccount,
  setOpenCreateAccount,
  accounts,
  getAccounts,
}: {
  setEditAccount: (arg: Account | null) => void;
  setOpenCreateAccount: (arg: boolean) => void;
  getAccounts: () => void;
  accounts: Account[];
}) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const { t } = useTranslation();

  const [deleteAccount, setDeleteAccount] = React.useState<Account | null>(
    null
  );

  const { username } = useAppSelector(({ authentication }) => authentication);
  // const { allAcounts } = useAppSelector((state) => state.accounts);

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
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - accounts.length) : 0;

  const visibleRows = React.useMemo(
    () => accounts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [page, rowsPerPage, accounts]
  );

  const handleClickEdit = (account: Account) => () => {
    setEditAccount(account);
    setOpenCreateAccount(true);
  };
  const handleClickDelete = (account: Account) => () => {
    setDeleteAccount(account);
  };

  const confirmDeleteAccount = async () => {
    if (username === deleteAccount?.username) {
      toast.error(t('info.accountInUse'));
      return;
    }
    await window.electron.removeAccount(deleteAccount?.username!);
    setDeleteAccount(null);
    getAccounts();
    toast.success('success');
  };

  return (
    <Card variant="outlined" sx={{ width: '100%', mb: 2 }}>
      <div>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          p={2}
        >
          <Typography variant="h6"> {t('administration.accounts')}</Typography>
          <Button
            startIcon={<AddIcon />}
            onClick={() => setOpenCreateAccount(true)}
            variant="outlined"
          >
            {t('account.add')}
          </Button>
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
                    onClick={() => handleClickEdit(row)}
                    role="checkbox"
                    tabIndex={-1}
                    key={row.username}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell>
                      <Avatar sx={{ backgroundColor: 'info.light' }}>
                        {row.photo ? (
                          <img
                            // @ts-ignore
                            src={row.photo}
                            width="100%"
                            alt={row.username}
                          />
                        ) : (
                          row.username.charAt(0).toUpperCase()
                        )}
                      </Avatar>
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    >
                      {row.username}
                    </TableCell>
                    <TableCell align="left">{row.phoneNumber}</TableCell>

                    <TableCell align="right">{row.createdAt}</TableCell>
                    <TableCell align="right">{t(row.permission)}</TableCell>
                    <TableCell align="right">{row.role}</TableCell>

                    <TableCell align="right">
                      <Stack direction="row" justifyContent="end" spacing={1}>
                        <Button
                          size="small"
                          startIcon={<DeleteIcon />}
                          onClick={handleClickDelete(row)}
                          color="error"
                          disabled={row.username === 'admin'}
                        >
                          {t('actions.delete')}
                        </Button>

                        <IconButton onClick={handleClickEdit(row)}>
                          <EditIcon />
                        </IconButton>
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
            {t('common.nothingToShow')}
          </Typography>
        )}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={accounts.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage={t('common.rowsPerPage')}
        />
      </div>
      <Dialog open={!!deleteAccount} onClose={() => setDeleteAccount(null)}>
        <DialogTitle>{t('user.delete')}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {t('user.confirmDelete')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteAccount(null)}>
            {t('actions.cancel')}
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={confirmDeleteAccount}
            autoFocus
          >
            {t('actions.confirm')}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
