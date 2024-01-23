import React from 'react';
import Toast from 'react-bootstrap/Toast';

const Toaster = (props) => {
  const customStyles = {
    position: 'absolute',
    top: '10px',
    left: 'calc(450px - 175px)',
    border: 'none',
    boxShadow: 'none',
    zIndex:11111
  };
    return (
      <Toast className={`text-center ${props.bg} text-white`} style={customStyles}>
        <Toast.Body>{props.message}</Toast.Body>
      </Toast>
    )
};

export default Toaster;
