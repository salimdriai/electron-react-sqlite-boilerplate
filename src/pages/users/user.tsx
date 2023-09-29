import * as React from 'react';

import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import PageToolbar from '../../components/Toolbar';
import PageSection from '../../layout/PageSection';

export default function UserPage() {
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
        <div>users</div>
      </PageSection>
    </>
  );
}
