import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import PageToolbar from '../../components/Toolbar';
import PageSection from '../../layout/PageSection';

export default function ProductsPage() {
  const navigate = useNavigate();

  const navigateToAddProduct = () => {
    navigate('/products/add');
  };
  return (
    <>
      <PageToolbar
        title="products"
        buttonLabel="add product"
        buttonIcon={<AddIcon />}
        buttonOnClick={navigateToAddProduct}
      />
      <PageSection>
        <h1 style={{ textAlign: 'center', marginTop: '10%' }}>Coming soon</h1>
      </PageSection>
    </>
  );
}
