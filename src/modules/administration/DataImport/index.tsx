import * as React from 'react';
import { toast } from 'react-toastify';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { importSubscriptions, importUsers, importPlans } from 'utils';
import { useTranslation } from 'react-i18next';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const FileBox = styled(Box)({
  width: 250,
  height: 100,
  border: '1px dashed #ccc',
  borderRadius: '8px',
  marginBottom: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

function ImportUsers() {
  const [isLoading, setIsloading] = React.useState(false);
  const [createdUsers, setCreatedUsers] = React.useState(0);
  const [filesData, setFilesData] = React.useState<{
    users: any;
    subscriptions: any;
    plans: any;
  }>({
    users: null,
    subscriptions: null,
    plans: null,
  });

  const readFile = (name: string, file: File) => {
    const reader = new FileReader();

    if (file) {
      reader.onload = (e: any) => {
        try {
          const fileContent = JSON.parse(e.target.result);
          const { data } = fileContent.find((obj: any) => obj.type === 'table');
          setFilesData({ ...filesData, [name]: data });
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      };

      reader.readAsText(file);
    }
  };

  const createUsers = async () => {
    const usersPayload = importUsers(filesData.users);

    const promises = usersPayload.map((payload) => {
      setCreatedUsers((prev) => prev + 1);
      return window.electron.createUser(payload);
    });
    await Promise.all(promises);
  };

  const createPlans = async () => {
    const plansPayload = importPlans(filesData.plans);
    const promises = plansPayload.map((payload) =>
      window.electron.createSubscriptionPlan(payload)
    );
    await Promise.all(promises);
  };

  const createSubscriptions = async () => {
    const subscriptionsPayload = importSubscriptions(
      filesData.subscriptions,
      filesData.users
    );
    const promises = subscriptionsPayload.map((payload) =>
      window.electron.createSubscription(payload)
    );
    await Promise.all(promises);
  };

  const onImport = async () => {
    try {
      setIsloading(true);
      await createPlans();
      await createUsers();
      await createSubscriptions();
      setIsloading(false);
    } catch (error) {
      setIsloading(false);
      toast(JSON.stringify(error));
      console.log('error', error);
    }
  };

  const { t } = useTranslation();

  const backup = async () => {
    await window.electron
      .backupDB()
      .then((res) => console.log('res', res))
      .catch((err) => console.log('err', err));
  };

  return (
    <Card variant="outlined" sx={{ p: 2 }}>
      <Button onClick={backup} variant="contained">
        Data Backup
      </Button>
      {/* <Typography variant="h6" gutterBottom>
        Data import{' '}
        <Typography color="error" component="span">
          {' '}
          ( This area is for developers only ! )
        </Typography>
      </Typography>
      <Stack direction="row" justifyContent="start" spacing={2} my={2}>
        <Box>
          <FileBox>
            {filesData.users?.length
              ? `${filesData.users?.length} users found`
              : 'nothing uploaded !'}
          </FileBox>
          <Button
            fullWidth
            component="label"
            variant="outlined"
            startIcon={<CloudUploadIcon />}
          >
            Upload users
            <VisuallyHiddenInput
              type="file"
              onChange={(e: any) => readFile('users', e.target.files[0])}
            />
          </Button>
        </Box>
        <Box>
          <FileBox>
            {filesData.subscriptions?.length
              ? `${filesData.subscriptions?.length} subscriptions found`
              : 'nothing uploaded !'}
          </FileBox>

          <Button
            fullWidth
            component="label"
            variant="outlined"
            startIcon={<CloudUploadIcon />}
          >
            Upload subscriptions
            <VisuallyHiddenInput
              type="file"
              onChange={(e: any) =>
                readFile('subscriptions', e.target.files[0])
              }
            />
          </Button>
        </Box>
        <Box>
          <FileBox>
            {filesData.plans?.length
              ? `${filesData.plans?.length} plans found`
              : 'nothing uploaded !'}
          </FileBox>

          <Button
            fullWidth
            component="label"
            variant="outlined"
            startIcon={<CloudUploadIcon />}
          >
            Upload plans
            <VisuallyHiddenInput
              type="file"
              onChange={(e: any) => readFile('plans', e.target.files[0])}
            />
          </Button>
        </Box>
      </Stack>
      <Stack>
        <Typography gutterBottom>Users created : {createdUsers}</Typography>
      </Stack>
      <Button disabled={isLoading} variant="contained" onClick={onImport}>
        {isLoading ? 'processing...' : 'import'}
      </Button> */}
    </Card>
  );
}

export default ImportUsers;
