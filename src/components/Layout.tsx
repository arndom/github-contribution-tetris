import { ReactNode } from 'react';
import { Box, Container } from '@mui/material';
import Footer from './Footer';

interface Props {
  children: ReactNode;
}

const Layout = (props: Props) => {
  const { children } = props;

  return (
    <main>
      <Container
        maxWidth='xl'
        sx={{
          minHeight: '100vh',
          backgroundImage: 'radial-gradient(50% 100%, rgba(0, 56, 32, 0.45) 0, #00040B 75%)',

          a: {
            textDecoration: 'none'
          }
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            minHeight: 'calc(100vh - 36px)'
          }}
        >
          {children}
        </Box>
        <Footer />
      </Container>
    </main>
  );
};

export default Layout;
