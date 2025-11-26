import React, { useState, useEffect, useRef } from "react";
import { HubConnectionBuilder } from "@microsoft/signalr";
import ChatInput from "./ChatInput";
import ChatWindow from "./ChatWindow";
import { vars } from "../../utils/vars";
import { useSelector } from "react-redux";
import { FreelancerApi } from "../../api";

// import ChatWindow from './ChatWindow/ChatWindow';
// import ChatInput from './ChatInput/ChatInput';

const Chat = (props) => {
  const [chat, setChat] = useState([]);
  const [connection, setConnection] = useState(null);
  const [connectionId, setConnectionId] = useState(null);
  const latestChat = useRef(null);
  const userRedux = useSelector((state) => state.user.value);
  latestChat.current = chat;

  // useEffect(() => {
  //   const connection = new HubConnectionBuilder()
  //     .withUrl(vars.BACKEND_URL + "hubs/chat")
  //     .withAutomaticReconnect()
  //     .build();

  //   connection
  //     .start()
  //     .then(async (result) => {
  //       console.log("Connected!" + result);

  //       connection.on("UsersAdded", (message) => {
  //         const updatedChat = [...latestChat.current];
  //         message.date = new Date();
  //         updatedChat.push(message);

  //         setChat(updatedChat);
  //       });

  //       if (connection.state === "Connected") {
  //         connection
  //           .invoke("SubscribeToBoard", props.chat.identifier)
  //           .catch((err) => {
  //             return console.error(err.toString());
  //           });
  //       }

  //       connection.on("Message", (message) => {
  //         if (message.user) {
  //           const updatedChat = [...latestChat.current];
  //           message.date = new Date();
  //           updatedChat.push(message);

  //           setChat(updatedChat);
  //         }
  //       });
  //     })
  //     .catch((e) => console.log("Connection failed: ", e));
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  useEffect(() => {
    if (userRedux?.id) {
      const connect = new HubConnectionBuilder()
        .withUrl(vars.BACKEND_URL + "hubs/message")
        .withAutomaticReconnect()
        .build();

      setConnection(connect);
    }
  }, [userRedux?.id]);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          console.log("Connected!");
          connection.on("ReceiveChatMessage", (message) => {
            console.log("NOTIFICATION: " + message);
            // dispatch(addNotification(message));
            const updatedChat = [...latestChat.current];
            message.date = new Date();
            updatedChat.push(message);

            setChat(updatedChat);
          });
          //   connection.invoke('ReceiveMessage', data, connectionId)
          //   .then(notification =>{

          //   })
        })
        .then(() => {
          getConnectionId();
        })
        .catch((error) => console.log(error));
    }
  }, [connection]);

  const getConnectionId = () => {
    connection.invoke("getconnectionid").then(async (data) => {
      console.log(data);
      setConnectionId(data);
      FreelancerApi.updateChatId(userRedux.id, data);
    });
  };

  useEffect(() => {
    const messages = [];
    props.chat?.chatMessages?.forEach((element) => {
      messages.push({
        user: element?.user?.name,
        message: element?.message,
        date: element?.date,
      });
    });
    setChat(messages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.chat]);

  const sendMessage = async (message) => {
    const chatMessage = {
      user: props.user.name,
      message: message,
      group: props.chat.identifier,
      userId: props.user.id,
      toUserId:
        userRedux.id === props.chat.user.id
          ? props.chat.freelancer.id
          : props.chat.user.id,
      chatId: props.chat.id,
    };

    try {
      await fetch(vars.BACKEND_URL + "api/v1/chat/messages", {
        method: "POST",
        body: JSON.stringify(chatMessage),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const updatedChat = [...latestChat.current];
      chatMessage.date = new Date();
      updatedChat.push(chatMessage);

      setChat(updatedChat);
    } catch (e) {
      console.log("Sending message failed.", e);
    }
  };

  return (
    <div>
      <ChatWindow chat={chat} />
      <hr />
      <ChatInput sendMessage={sendMessage} />
    </div>
  );
};

export default Chat;
