import React from 'react';

import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import PageToolbar from 'components/Toolbar';
import PageSection from 'layout/PageSection';
import Accounts from 'modules/administration/Accounts';

function AdministrationPage() {
  const navigate = useNavigate();

  const navigateToAddAccount = () => {
    navigate('/administration/add-account');
  };
  return (
    <>
      <PageToolbar
        title="administration"
        buttonLabel="add account"
        buttonIcon={<AddIcon />}
        buttonOnClick={navigateToAddAccount}
      />
      <PageSection>
        <Accounts />
      </PageSection>
    </>
  );
}

export default AdministrationPage;
