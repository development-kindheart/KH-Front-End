import PropTypes from "prop-types";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useSocketContext } from "../redux/SocketContext";
import { socketEmitEvent } from "../socket/emit";
import { useSelector } from "react-redux";
import useApi from "../hooks/useApi";
import apiClient from "../api/apiClient";

export const ChatContext = createContext({});

export const useChatContext = () => useContext(ChatContext);

function ChatContextProvider({ children }) {
  const { userId, isLoggedIn } = useSelector((state) => state.auth);
  const {
    socketValue: { socket, onlineUsers, messageData },
  } = useSocketContext();
  const [chatInfo, setChatInfo] = useLocalStorage("chat-app-chat-info", null);
  const [contacts, setContacts] = useState([]);

  const chatId = chatInfo?._id || null;

  const { request: getUserContactsRequest } = useApi((userId) =>
    apiClient.get(`/api/users/${userId}/contacts`)
  );

  const fetchUserContacts = () => {
    if (isLoggedIn) {
      getUserContactsRequest(userId).then((res) => {
        const contactsWithOnlineStatus = res.data.data.map((contact) => ({
          ...contact,
          isOnline:
            onlineUsers?.some((user) => user.userId === contact._id) || false,
        }));
        setContacts(contactsWithOnlineStatus);
      });
    }
  };

  useEffect(() => {
    fetchUserContacts();
  }, [onlineUsers]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchUserContacts();
    }
  }, [isLoggedIn]);

  const updateContactLatestMessage = useCallback(
    (latestMessageData) => {
      const { updateId, sender, message, updatedAt, unreadCount } =
        latestMessageData;

      setContacts((prevContact) =>
        prevContact.map((contact) => {
          return contact._id === updateId
            ? {
                ...contact,
                latestMessage: message,
                latestMessageSender: sender,
                latestMessageUpdatedAt: updatedAt,
                unreadCount: chatId === sender ? 0 : unreadCount,
              }
            : contact;
        })
      );
    },
    [chatId]
  );

  useEffect(() => {
    if (messageData) {
      const { type, receiver, sender } = messageData;
      updateContactLatestMessage({
        ...messageData,
        updateId: type === "room" ? receiver : sender,
      });
    }
  }, [messageData, updateContactLatestMessage]);

  const { request: updateReadStatusRequest } = useApi((updateData) =>
    apiClient.put(
      `/api/users/${updateData.userId}/messages/status?chatId=${updateData.chatId}&type=${updateData.type}`
    )
  );

  const updateMessageStatusToRead = (chatId, type) => {
    updateReadStatusRequest({
      userId: userId,
      chatId,
      type,
    });

    socketEmitEvent(socket).updateMessageReaders({
      readerId: userId,
      toId: chatId,
      type,
    });
  };

  const handleChatSelect = async (selected) => {
    console.log(selected,'----------selected')
    if (selected._id !== chatId) {
      if (selected.chatType === "room") {
        socketEmitEvent(socket).enterChatRoom({
          roomId: selected._id
        });
      }
      if (chatInfo?.chatType === "room") {
        socketEmitEvent(socket).leaveChatRoom({
          roomId: chatId,
        //  message: `${user.name} has left the chat.`,
        });
      }
      setChatInfo(selected);
      updateMessageStatusToRead(selected._id, selected.chatType);
      setContacts((prevContacts) =>
        prevContacts.map((prev) =>
          prev._id === selected._id ? { ...prev, unreadCount: 0 } : prev
        )
      );
    }
  };

  return (
    <ChatContext.Provider
      value={{
        chatId,
        chatInfo,
        setChatInfo,
        contacts,
        setContacts,
        handleChatSelect,
        updateContactLatestMessage,
        updateMessageStatusToRead,
        fetchUserContacts,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

ChatContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ChatContextProvider;
