import React from 'react';

import { useTranslation } from 'react-i18next';
import PageToolbar from 'components/Toolbar';
import PageSection from 'layout/PageSection';
import Administration from 'modules/administration';

function AdministrationPage() {
  const { t } = useTranslation();

  return (
    <>
      <PageToolbar title={t('common.administration')} />
      <PageSection>
        <Administration />
      </PageSection>
    </>
  );
}

export default AdministrationPage;
