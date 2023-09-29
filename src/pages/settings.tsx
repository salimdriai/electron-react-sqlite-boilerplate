import * as React from 'react';

import { useTranslation } from 'react-i18next';
import PageToolbar from 'components/Toolbar';
import PageSection from 'layout/PageSection';
import Settings from 'modules/settings';

export default function SettingsPage() {
  const { t } = useTranslation();

  return (
    <>
      <PageToolbar title={t('common.settings')} />
      <PageSection>
        <Settings />
      </PageSection>
    </>
  );
}
