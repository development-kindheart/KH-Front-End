import PropTypes from 'prop-types';
import { useState, useEffect, useCallback } from 'react';
import { OuterContainer, Container } from '../../components/MainContainer';
import Form from '../../components/Form';
import { Button, PrimaryButton } from '../../components/Button';
import TextInput from '../../components/TextInput';
import styled from 'styled-components';
import { warningToast } from '../../utils/toastify';
import { IoArrowUndo } from 'react-icons/io5';

function RoomForm({ handleRoomCreate, isLoading, toggleShow }) {
  const [formData, setFormData] = useState({
    roomname: '',
  });

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.roomname) return warningToast('Room name is required!');
    handleRoomCreate(formData);
  };



  return (
    <OuterContainer>
      <FormContainer>
        <Form onSubmit={(e) => handleFormSubmit(e)}>
          <FormTitle>Enter Room Details</FormTitle>
          <TextInput
            type="text"
            placeholder="Room Name"
            name="roomname"
            id="roomname"
            value={formData.roomname}
            onChange={(e) => setFormData((prev) => ({ ...prev, roomname: e.target.value }))}
          />
          <PrimaryButton>{isLoading ? 'Loading...' : 'Confirm'}</PrimaryButton>
          <DisplayControl>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                toggleShow();
              }}
            >
              <IconWrapper>
                <IoArrowUndo />
              </IconWrapper>
              Back
            </Button>
          </DisplayControl>
        </Form>
      </FormContainer>
    </OuterContainer>
  );
}

RoomForm.propTypes = {
  handleRoomCreate: PropTypes.func,
  isLoading: PropTypes.bool,
  toggleShow: PropTypes.func
};

const FormContainer = styled(Container)`
  height: 100%;

  @media screen and (min-width: 768px) {
    padding-top: calc(40px + 28px + 16px);
    display: flex;
    align-items: flex-start;
  }
`;

const FormTitle = styled.h1`
  font-size: 1.25rem;
  font-weight: 500;
  letter-spacing: 1px;
  text-align: center;
  margin: 0.5rem 0;
`;

const DisplayControl = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;

  @media screen and (min-width: 768px) {
    display: none;
  }
`;

const IconWrapper = styled.span`
  position: relative;
  top: 2px;
  margin-right: 0.5rem;
`;

export default RoomForm;
