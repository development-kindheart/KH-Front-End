import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { IoSend } from "react-icons/io5";
import { useChatContext } from "../../redux/ChatContext";
import { useSocketContext } from "../../redux/SocketContext";
import { socketEmitEvent } from "../../socket/emit";
import useApi from "../../hooks/useApi";
import apiClient from "../../api/apiClient";
import { useSelector } from "react-redux";

function ChatRoomInput({ setChatMessages }) {
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showNotify, setShowNotify] = useState(false);

  const { userId } = useSelector((state) => state.auth);
  const { chatId, chatInfo, updateContactLatestMessage } = useChatContext();
  const {
    socketValue: { socket, typingNotify },
  } = useSocketContext();

  const { request } = useApi((userId, chatId, type, inputMessage) =>
    apiClient.post(
      `/api/users/${userId}/message?chatId=${chatId}&type=${type}`,
      { message: inputMessage }
    )
  );

  const handleInputSubmit = async (e) => {
    e.preventDefault();
    if (inputMessage.trim() === "") {
      setInputMessage("");
      return;
    }
    console.log(inputMessage, "inputMessage --------------");
    const res = await request(userId, chatId, chatInfo.chatType, inputMessage);
    if (res.ok) {
      setChatMessages((prev) => [
        ...prev,
        {
          ...res.data.data,
          // avatarImage: user.avatarImage
        },
      ]);
      socketEmitEvent(socket).sendMessage({
        ...res.data.data,
        // avatarImage: user.avatarImage,
        type: chatInfo.chatType,
        receiver: chatId,
      });

      updateContactLatestMessage({
        ...res.data.data,
        type: chatInfo.chatType,
        updateId: chatId,
        unreadCount: 0,
      });

      setInputMessage("");
    }
  };

  const handleKeyUp = () => {
    const newTypingStatus = inputMessage.trim() !== "";
    if (isTyping !== newTypingStatus) {
      socketEmitEvent(socket).userTyping({
        chatType: chatInfo.chatType,
        senderId: userId,
        receiverId: chatId,
        typing: newTypingStatus,
        message: `user is typing...`,
      });
    }
    setIsTyping(newTypingStatus);
  };

  useEffect(() => {
    if (typingNotify) {
      const { chatType, senderId, receiverId, typing } = typingNotify;
      const isChatting =
        chatType === "user" ? chatId === senderId : chatId === receiverId;
      setShowNotify(typing && isChatting);
    } else {
      setShowNotify(false);
    }
  }, [typingNotify, chatId]);

  return (
    <>
      {showNotify && (
        <TypeBox>
          <TypeWriter>
            <TypeContent>{typingNotify.message}</TypeContent>
          </TypeWriter>
        </TypeBox>
      )}
      {chatId ? (
        <RoomField onSubmit={handleInputSubmit}>
          <RoomInput
            type="text"
            name="inputMessage"
            placeholder="Type something"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyUp={handleKeyUp}
          />
          <RoomInputButton>
            <ButtonIconWrapper>
              <IoSend />
            </ButtonIconWrapper>
          </RoomInputButton>
        </RoomField>
      ) : null}
    </>
  );
}

const typing = keyframes`
  from {
    width: 0;
  }

  to {
    width: 100%;
  }
`;

const blinkCaret = keyframes`
  from, to {
    border-color: transparent;
  }

  50% {
    border-color: var(--primary);
  }
`;

const TypeBox = styled.div`
  display: flex;
  align-items: flex-start;
`;

const TypeWriter = styled.div`
  margin: 0 1rem;
`;

const TypeContent = styled.p`
  overflow: hidden;
  border-right: 0.15em solid var(--primary);
  font-size: 0.75rem;
  white-space: nowrap;
  letter-spacing: 1px;
  animation: ${typing} 2s steps(40, end), ${blinkCaret} 0.5s step-end infinite;
`;

const RoomField = styled.form`
  margin: 0.5rem;
  height: 55px;
  background-color: var(--bg-color-darken);
  border-radius: 20px;
  display: flex;
  align-items: center;
`;

const RoomInput = styled.input`
  flex: 1;
  padding: 1rem;
  margin: 0 0.5rem 0 1rem;
  border-radius: 20px;
  border: none;
  background-color: transparent;
  color: var(--main-color);
  outline: none;
  font-size: 1rem;
  border: 1px solid black;
`;

const RoomInputButton = styled.button`
  margin-right: 0.5rem;
  width: 40px;
  height: 40px;
  border-radius: 15px;
  background-color: var(--primary);
  color: var(--bg-color-main);
  outline: none;
  border: none;
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ButtonIconWrapper = styled(IconWrapper)`
  font-size: 1.15rem;
  transform: rotate(-40deg);
  padding-left: 6px;
  cursor: pointer;
`;

export default ChatRoomInput;
