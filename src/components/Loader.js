import React from 'react';
import { Spinner } from 'react-bootstrap';

const Loader = () => {
  const customStyles = {
    position: 'absolute',
    top:'40%',
    left:'40%',
    width:'100px',
    height:'100px',
    zIndex:1111
  };
  return (
    <Spinner style={customStyles} animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  )
};

export default Loader;
