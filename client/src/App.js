import React from 'react';
import { useRouters } from './routs';
import { BrowserRouter } from 'react-router-dom'
import Container from 'react-bootstrap/Container';

function App() {
  const routes = useRouters();

  return (
    <BrowserRouter>
        <Container>
          {routes}
        </Container>
    </BrowserRouter>
  )
}

export default App;
