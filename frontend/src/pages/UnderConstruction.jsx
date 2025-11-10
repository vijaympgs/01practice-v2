import React from 'react';
import { Typography, Container } from '@mui/material';

const UnderConstruction = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
        <PageTitle 
          title="Under Construction" 
          subtitle="This page is currently being developed"
          showIcon={true}
          icon={<Construction />}
        />
    </Container>
  );
};

export default UnderConstruction;
