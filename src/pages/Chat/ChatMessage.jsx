import PropTypes from 'prop-types';
import { forwardRef, useRef, useImperativeHandle } from 'react';
import styled from 'styled-components';
import Avatar from '../../components/Avatar';
import { useChatContext } from '../../redux/ChatContext';
import { timeFormatter } from '../../utils/timeFormatter';
import { useSelector } from 'react-redux';

const ChatMessage = forwardRef(function ChatMessage({ sender, avatarImage, _id, message, updatedAt, readers }, ref) {
  const { userId } = useSelector((state) => state.auth);
  const { chatInfo } = useChatContext();
  const messageRef = useRef(null);

  useImperativeHandle(
    ref,
    () => {
      return {
        scrollIntoView() {
          messageRef.current.scrollIntoView({
            behavior: 'smooth'
          });
        }
      };
    },
    []
  );

  const fromSelf = userId === sender;
  const isRoom = chatInfo.chatType === 'room';

  return (
    <Message className={fromSelf ? 'self' : null} ref={messageRef}>
      {/*<Avatar size="medium" src={`data:image/svg+xml;base64,${avatarImage}`} />*/}
      {/*<Avatar size="medium" src={`${chatInfo.avatarImage}`} />*/}
      <Text className={fromSelf ? 'self' : null}>{message}</Text>
      <MessageDetail className='new'>
        {readers.length > 0 && fromSelf && <Status>Read {isRoom && readers.length}</Status>}
        <Time>{timeFormatter(updatedAt)}</Time>
      </MessageDetail>
    </Message>
  );
});

ChatMessage.propTypes = {
  sender: PropTypes.string.isRequired,
  avatarImage: PropTypes.string.isRequired,
  _id: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  updatedAt: PropTypes.string.isRequired,
  readers: PropTypes.array.isRequired
};

const Message = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  margin: 1.5rem 0;

  &.self {
    flex-direction: row-reverse;
    align-self: flex-end;
  }
`;

const Text = styled.p`
  padding: 1rem 1rem;
  margin-left: 0.5rem;
  background-color: #B8E1FF;
  border-radius: 20px;
  border-top-left-radius: 4px;
  max-width: 55%;
  font-weight: 400;
  color: white;

  &.self {
    border-top-right-radius: 4px;
    border-top-left-radius: 20px;
    background-color: #DE89BE;
    color: ${(props) => (props.theme.mode === 'light' ? 'var(--bg-color-main)' : 'var(--main-color)')};
    margin-left: 0;
  }
`;

const MessageDetail = styled.div`
  align-self: flex-end;
  color: var(--main-color);
`;

const Status = styled.span`
  font-size: 0.65rem;
  text-transform: capitalize;
  font-weight: 400;
`;

const Time = styled.p`
  font-size: 0.65rem;
  font-weight: 500;
  margin-bottom: 4px;
`;

export default ChatMessage;
