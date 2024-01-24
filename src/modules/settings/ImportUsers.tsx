import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Card, Typography } from '@mui/material';
import { importUsers } from 'utils/importUsers';

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
  }>({
    users: null,
    subscriptions: null,
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

  const createUser = async (data: any) => {
    await window.electron.insertUser(data);
  };

  const onImport = async () => {
    try {
      setIsloading(true);

      const payload = importUsers({
        members: filesData.users,
        subscriptions: filesData.subscriptions,
      });

      const promises = payload.map(async (user) => {
        await createUser(user);
        setCreatedUsers((prev) => prev + 1);
      });

      await Promise.all(promises);
      setIsloading(false);
    } catch (error) {
      console.log('error', error);
    }
  };

  return (
    <Card variant="outlined" sx={{ p: 2, display: 'inline-block' }}>
      <Stack direction="row" spacing={2} mb={1}>
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
      </Stack>
      <Stack>
        <Typography gutterBottom>Users created : {createdUsers}</Typography>
      </Stack>
      <Button
        disabled={isLoading}
        fullWidth
        variant="contained"
        onClick={onImport}
      >
        {isLoading ? 'processing...' : 'import'}
      </Button>
    </Card>
  );
}

export default ImportUsers;
