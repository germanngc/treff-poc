import React, { useEffect, useRef } from "react";
import Message from "./Message";

// import Message from './Message/Message';

const ChatWindow = (props) => {
  const element = useRef(null);

  useEffect(()=>{
    document.getElementById("chat").scrollTop = document.getElementById("chat").scrollHeight
  }, [props.chat])

  const chat = props.chat.map((m) => (
    <Message
      key={Date.now() * Math.random()}
      user={m.user}
      message={m.message}
      date={m.date}
    />
  ));

  return (
    <div id="chat" ref={element} style={{ maxHeight: "60vh", overflowY: "auto" }}>
      {chat}
    </div>
  );
};

export default ChatWindow;
