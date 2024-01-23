import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import ChatRoomHeader from "./ChatRoomHeader";
import ChatRoomMessage from "./ChatRoomMessage";
import ChatRoomInput from "./ChatRoomInput";
import { useChatContext } from "../../redux/ChatContext";
import { useSocketContext } from "../../redux/SocketContext";
import apiClient from "../../api/apiClient";
import useApi from "../../hooks/useApi";
import { useSelector } from "react-redux";

function ChatRoom() {
  const { userId } = useSelector((state) => state.auth);
  const { chatId, chatInfo, updateMessageStatusToRead } = useChatContext();
  const {
    socketValue: { messageData, messageReadStatus },
    resetSocketValue,
  } = useSocketContext();

  const [chatMessages, setChatMessages] = useState([]);

  const {
    request: getUserMessages,
    loading,
    error,
  } = useApi((userId, chatId, chatType) =>
    apiClient.get(
      `/api/users/${userId}/messages?chatId=${chatId}&type=${chatType}`
    )
  );

  const fetchMessages = async () => {
    const res = await getUserMessages(userId, chatId, chatInfo.chatType);
    if (res.ok) {
      setChatMessages(res.data.data);
    }
  };

  useEffect(() => {
    if (chatId) {
      fetchMessages();
    }
  }, [chatId, userId, chatInfo]);

  const checkIsChatting = useCallback(
    (messageData) => {
      const { type, sender, receiver } = messageData;
      return type === "user" ? chatId === sender : chatId === receiver;
    },
    [chatId]
  );

  const updateSelfMessageStatus = useCallback(
    (messageData) => {
      setChatMessages((prev) => [
        ...prev,
        {
          ...messageData,
          readers: [userId],
        },
      ]);
    },
    [userId]
  );

  useEffect(() => {
    if (messageData) {
      const isChatting = checkIsChatting(messageData);
      if (isChatting) {
        updateSelfMessageStatus(messageData);
        const { receiver, sender, type } = messageData;
        const toId = type === "room" ? receiver : sender;
        updateMessageStatusToRead(toId, type);
      }
      resetSocketValue("messageData");
    }
  }, [
    messageData,
    checkIsChatting,
    updateSelfMessageStatus,
    updateMessageStatusToRead,
    resetSocketValue,
  ]);

  useEffect(() => {
    if (messageReadStatus) {
      const { type, readerId, toId: receiveRoomId } = messageReadStatus;
      const isChatting =
        type === "user" ? chatId === readerId : chatId === receiveRoomId;
      if (isChatting) {
        setChatMessages((prev) =>
          prev.map((msg) =>
            msg.sender !== readerId
              ? { ...msg, readers: [...msg.readers, readerId] }
              : msg
          )
        );
      }
    }
  }, [messageReadStatus, chatId]);

  return (
    <RoomWrapper>
      <ChatRoomHeader />
      <ChatRoomMessage chatMessages={chatMessages} messageLoading={loading} />
      <ChatRoomInput setChatMessages={setChatMessages} />
    </RoomWrapper>
  );
}

const RoomWrapper = styled.div`
  margin: 1rem 0 0;
  width: 100%;
  height: calc(100% - 1rem);
  background-color: var(--bg-color-main);
  border-top-left-radius: 20px;
  border-top-right-radius: 8px;
  border: 2px solid var(--bg-color-darken);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export default ChatRoom;
