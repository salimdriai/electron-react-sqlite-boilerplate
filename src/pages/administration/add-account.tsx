import * as React from 'react';
import PageToolbar from 'components/Toolbar';
import PageSection from 'layout/PageSection';
import AccountForm from 'modules/administration/AccountForm';

function AddAccountPage() {
  return (
    <>
      <PageToolbar title="add account" />
      <PageSection>
        <AccountForm />
      </PageSection>
    </>
  );
}

export default AddAccountPage;
