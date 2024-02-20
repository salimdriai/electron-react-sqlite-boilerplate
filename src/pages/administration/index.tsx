import React from 'react';

import { useTranslation } from 'react-i18next';
import AddIcon from '@mui/icons-material/Add';
import PageToolbar from 'components/Toolbar';
import PageSection from 'layout/PageSection';
import Administration from 'modules/administration';

function AdministrationPage() {
  const { t } = useTranslation();
  const [openCreateAccount, setOpenCreateAccount] = React.useState(false);

  const navigateToAddAccount = () => {
    setOpenCreateAccount(true);
  };

  return (
    <>
      <PageToolbar
        title={t('common.administration')}
        buttonLabel={t('account.add')}
        buttonIcon={<AddIcon />}
        buttonOnClick={navigateToAddAccount}
      />
      <PageSection>
        <Administration
          openCreateAccount={openCreateAccount}
          setOpenCreateAccount={setOpenCreateAccount}
        />
      </PageSection>
    </>
  );
}

export default AdministrationPage;
