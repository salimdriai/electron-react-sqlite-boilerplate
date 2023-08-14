import * as React from 'react';
import { useNavigate } from 'react-router-dom';

import AddIcon from '@mui/icons-material/Add';
import PageToolbar from '../../components/Toolbar';
import PageSection from '../../layout/PageSection';
import UsersTable from '../../modules/users/UsersTable';

export default function UsersPage() {
  const navigate = useNavigate();

  const navigateToAddUser = () => {
    navigate('/users/add');
  };
  return (
    <>
      <PageToolbar
        title="users"
        buttonLabel="add user"
        buttonIcon={<AddIcon />}
        buttonOnClick={navigateToAddUser}
      />
      <PageSection>
        <UsersTable />
      </PageSection>
    </>
  );
}
