import React from "react";
import Spinner from 'react-bootstrap/Spinner';

export const Loader = () => (
  <div className="d-flex justify-content-center" style={{
    position: 'absolute',
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center'
  }}>
    <Spinner animation="border" variant="primary">
      <span className="sr-only">Loading...</span>
    </Spinner>
  </div>
);