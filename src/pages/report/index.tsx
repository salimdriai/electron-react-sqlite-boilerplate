import * as React from 'react';
import { useTranslation } from 'react-i18next';
import Report from 'modules/report';
import PageToolbar from '../../components/Toolbar';
import PageSection from '../../layout/PageSection';

export default function ReportPage() {
  const { t } = useTranslation();
  return (
    <>
      <PageToolbar title={t('report.report')} />
      <PageSection>
        <Report />
      </PageSection>
    </>
  );
}
