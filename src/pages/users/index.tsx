import * as React from 'react';
import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';
import AddIcon from '@mui/icons-material/Add';
import PageToolbar from '../../components/Toolbar';
import PageSection from '../../layout/PageSection';
import UsersTable from '../../modules/users/UsersTable';

export default function UsersPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const navigateToAddUser = () => {
    navigate('/users/add');
  };
  return (
    <>
      <PageToolbar
        title={t('user.users')}
        buttonLabel={t('user.add')}
        buttonIcon={<AddIcon />}
        buttonOnClick={navigateToAddUser}
      />
      <PageSection>
        <UsersTable />
      </PageSection>
    </>
  );
}
