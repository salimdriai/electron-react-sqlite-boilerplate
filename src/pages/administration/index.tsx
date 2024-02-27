import React from 'react';

import { useTranslation } from 'react-i18next';
import PageToolbar from 'components/Toolbar';
import PageSection from 'layout/PageSection';
import Administration from 'modules/administration';

function AdministrationPage() {
  const { t } = useTranslation();
  const [openCreateAccount, setOpenCreateAccount] = React.useState(false);

  return (
    <>
      <PageToolbar title={t('common.administration')} />
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
