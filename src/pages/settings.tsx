import * as React from 'react';
import PageToolbar from 'components/Toolbar';
import PageSection from 'layout/PageSection';
import Settings from 'modules/settings';

export default function SettingsPage() {
  return (
    <>
      <PageToolbar title="settings" />
      <PageSection>
        <Settings />
      </PageSection>
    </>
  );
}
