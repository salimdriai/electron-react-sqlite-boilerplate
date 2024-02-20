import * as React from 'react';
import { useTranslation } from 'react-i18next';
import PageToolbar from '../../components/Toolbar';
import PageSection from '../../layout/PageSection';
import UserForm from '../../modules/users/UserForm';

export default function AddUserPage() {
  const { t } = useTranslation();

  return (
    <>
      <PageToolbar title={t('user.create')} />
      <PageSection>
        <UserForm />
      </PageSection>
    </>
  );
}
