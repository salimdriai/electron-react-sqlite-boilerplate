import * as React from 'react';
import PageToolbar from '../../components/Toolbar';
import PageSection from '../../layout/PageSection';
import UserForm from '../../modules/users/UserForm';

export default function AddUserPage() {
  return (
    <>
      <PageToolbar title="register user" />
      <PageSection>
        <UserForm />
      </PageSection>
    </>
  );
}
