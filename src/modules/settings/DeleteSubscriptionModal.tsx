import * as React from 'react';

import { useTranslation } from 'react-i18next';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import DeleteIcon from '@mui/icons-material/Delete';

export interface Props {
  open: boolean;
  onClose: (e?: any) => void;
  onClickDelete: () => void;
}

function DeleteSubscriptionModal(props: Props) {
  const { open, onClose, onClickDelete } = props;
  const { t } = useTranslation();

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Card sx={{ width: '500px', p: 2 }}>
        <CardHeader title="Confirm Deletion !" />
        <CardContent sx={{ alignItems: 'cetner' }}>
          <Stack alignItems="center">
            <DeleteIcon color="error" sx={{ fontSize: '60px' }} />
            <Typography>{t('subscriptions.confirmDelete')}</Typography>
          </Stack>
        </CardContent>
        <CardActions sx={{ justifyContent: 'end', mt: 4 }}>
          <Button onClick={onClose}>{t('actions.cancel')}</Button>
          <Button variant="contained" color="error" onClick={onClickDelete}>
            {t('actions.confirm')}
          </Button>
        </CardActions>
      </Card>
    </Modal>
  );
}

export default DeleteSubscriptionModal;
