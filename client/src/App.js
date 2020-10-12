import React from 'react';
import { useRouters } from './routs';
import { BrowserRouter } from "react-router-dom"
import { useAuth } from './hooks/auth.hook';
import { Loader } from './components/Loader';
import Container from 'react-bootstrap/Container';

function App() {
  const { ready } = useAuth();
  const routes = useRouters();
  
  if (!ready) {
    return <Loader />
  }

  return (
      <BrowserRouter>
        <Container>
          {routes}
        </Container>
      </BrowserRouter>
  )
}

export default App;
