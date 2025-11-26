import { HubConnectionBuilder } from "@microsoft/signalr";
// import { Button, Input, notification } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FreelancerApi, NotificationApi } from "../../api";
import { vars } from "../../utils/vars";
import { useDispatch } from "react-redux";
import {
  addNotification,
  addNotifications,
} from "../../redux/notificationReducer";

export const Notifications = () => {
  const [connection, setConnection] = useState(null);
  const [connectionId, setConnectionId] = useState(null);
  //   const [notifications, setNotifications] = useState([]);
  const userRedux = useSelector((state) => state.user.value);
  const dispatch = useDispatch();

  useEffect(() => {
    const getNotifications = async () => {
      if (userRedux) {
        const data = await NotificationApi.getNotificationsByFreelancerId(
          userRedux.id,
          true
        );
        dispatch(addNotifications(data));
      }
    };
    getNotifications();
  }, [userRedux, dispatch]);

  useEffect(() => {
    if (userRedux?.id) {
      const connect = new HubConnectionBuilder()
        .withUrl(vars.BACKEND_URL + "hubs/notification")
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
          connection.on("ReceiveNotification", (message) => {
            console.log("NOTIFICATION: " + message);
            dispatch(addNotification(message));
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
      FreelancerApi.updateNotificationId(userRedux.id, data);
    });
  };

  //   const sendMessage = async () => {
  //     if (connection) await connection.send("SendMessage", inputText);
  //     setInputText("");
  //   };

  return <></>;
};
