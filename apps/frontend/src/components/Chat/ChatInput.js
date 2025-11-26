import React, { useRef, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Toast } from "primereact/toast";

const ChatInput = (props) => {
  const [message, setMessage] = useState("");
  const toast = useRef(null);

  const onSubmit = (e) => {
    e.preventDefault();

    const isMessageProvided = message && message.trim() !== "";

    if (isMessageProvided) {
      if (hasURL(message) && !isValidURL(message)) {
        showToast("No se permiten URLs en el mensaje.", "error");
      } else {
        props.sendMessage(message);
        setMessage("");
      }
    } else {
      // alert("Please insert a message.");
    }
  };

  const onMessageUpdate = (value) => {
    setMessage(value);
  };

  const hasURL = (text) => {
    const urlRegex = /(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
    return urlRegex.test(text);
  };

  const isValidURL = (url) => {
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  };

  const showToast = (message, severity) => {
    toast.current.show({ severity, summary: "Error", detail: message });
  };

  return (
    <form onSubmit={onSubmit}>
      <Toast ref={toast} />
      <ReactQuill
        value={message}
        onChange={onMessageUpdate}
        placeholder="Escribir un mensaje"
        style={{ height: "100px" }}
      />
      <br />
      <br />
      <br />
      <button className="button is-link" type="submit">
        Enviar
      </button>
    </form>
  );
};

export default ChatInput;
