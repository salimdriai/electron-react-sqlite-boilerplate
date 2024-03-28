import * as React from 'react';
import { useTranslation } from 'react-i18next';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Menu from '@mui/material/Menu';
import Drawer from '@mui/material/Drawer';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import DraftsIcon from '@mui/icons-material/Drafts';
import MarkunreadIcon from '@mui/icons-material/Markunread';
// import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useAppDispatch, useAppSelector } from 'features/store';
import { SubscriptionPlan, Notification } from 'types';
import {
  // deleteNotification,
  generateNotifications,
  getNotifications,
  toggleReadNotification,
} from 'features/notifications/reducers';
import UserDetails from 'modules/users/UserDetails';
import { setUser } from 'features/users';

export default function Notifications() {
  const [openUserDetails, setOpenUserDetails] = React.useState(false);
  const [plans, setPlans] = React.useState<SubscriptionPlan[]>([]);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const { notifications, unreadCount } = useAppSelector(
    (state) => state.notifications
  );
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const { users } = useAppSelector((state) => state.users);

  const toggleRead = async (notification: Notification, read: boolean) => {
    await dispatch(toggleReadNotification({ notification, read }));
    dispatch(getNotifications());
  };

  const onClickNotification = (notif: Notification) => async () => {
    // eslint-disable-next-line eqeqeq
    const user = users.find((u) => u.id == notif.userId);

    dispatch(setUser(user));
    toggleRead(notif, true);
    setAnchorEl(null);
    setOpenUserDetails(true);
  };

  const getPlan = (planId: string) => {
    return plans.find((plan) => plan.id === planId);
  };

  // const removeNotification = (id: string) => async (e: any) => {
  //   e.stopPropagation();
  //   await dispatch(deleteNotification(id));
  //   dispatch(getNotifications());
  // };

  React.useEffect(() => {
    (async () => {
      const res = await window.electron.getSubscriptionPlans();
      setPlans(res);
    })();
  }, []);

  React.useEffect(() => {
    dispatch(generateNotifications(users));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users]);

  return (
    <div>
      <Tooltip title="notifications">
        <IconButton
          id="basic-button"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
          color="secondary"
          sx={{
            position: 'relative',
            backgroundColor: 'background.paper',
          }}
        >
          <Box
            sx={{
              width: 24,
              borderRadius: '50%',
              position: 'absolute',
              top: -6,
              right: -8,
              bgcolor: 'red',
            }}
          >
            <Typography color="white" fontSize={14} fontWeight={700}>
              {unreadCount}
            </Typography>
          </Box>
          <NotificationsActiveIcon color="primary" />
        </IconButton>
      </Tooltip>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box px={2} py={1}>
          <Typography variant="body2">Notifications</Typography>
        </Box>
        <Divider />
        {notifications.length === 0 ? (
          <MenuItem
            sx={{
              width: 500,
              height: 200,
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            empty
          </MenuItem>
        ) : (
          notifications.map((notif) => (
            <MenuItem
              sx={{
                width: 500,
                display: 'flex',
                gap: 2,
                py: 1,
              }}
              onClick={onClickNotification(notif)}
            >
              <Stack direction="row" spacing={2}>
                <Avatar sx={{ backgroundColor: 'info.main' }}>
                  {notif.photo ? (
                    <img
                      src={notif.photo as string}
                      width="100%"
                      alt={notif.username}
                    />
                  ) : (
                    notif.username.charAt(0).toUpperCase()
                  )}
                </Avatar>
                <Stack spacing={0.5} sx={{ opacity: notif.isRead ? 0.5 : 1 }}>
                  <Typography variant="body2" sx={{ lineHeight: 1 }}>
                    <b>{notif.username}</b> -{' '}
                    <span style={{ fontSize: 12 }}>{notif.createdAt}</span>
                  </Typography>
                  <Typography variant="body2" sx={{ lineHeight: 1 }}>
                    {t('subscriptions.subscription.expired')}{' '}
                    {`(${getPlan(notif.planId)?.name})`}
                  </Typography>
                </Stack>
              </Stack>

              <Stack
                flex={1}
                direction="row"
                alignItems="center"
                justifyContent="end"
              >
                <Tooltip
                  placement="top"
                  title={
                    notif.isRead
                      ? t('info.mark.as.unread')
                      : t('info.mark.as.read')
                  }
                >
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleRead(notif, !notif.isRead);
                    }}
                    edge="end"
                  >
                    {notif.isRead ? (
                      <DraftsIcon fontSize="small" color="info" />
                    ) : (
                      <MarkunreadIcon fontSize="small" color="info" />
                    )}
                  </IconButton>
                </Tooltip>
                {/* <IconButton
                  onClick={removeNotification(notif.id as string)}
                  edge="end"
                >
                  <DeleteOutlineIcon color="error" />
                </IconButton> */}
              </Stack>
            </MenuItem>
          ))
        )}
      </Menu>

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
        open={openUserDetails}
        onClose={() => {
          setOpenUserDetails(false);
          // dispatch(setUser(null));
        }}
      >
        <UserDetails />
      </Drawer>
    </div>
  );
}
