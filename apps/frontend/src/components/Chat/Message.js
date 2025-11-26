import { Avatar } from "primereact/avatar";
import React from "react";
import { useSelector } from "react-redux";
import { setDateString, setDateTimeString } from "../../utils/dates";
import { getURLImage } from "../../utils/images";

const Message = (props) => {
  const userRedux = useSelector((state) => state.user.value);
  const freelancerRedux = useSelector((state) => state.chat.chat.freelancer);
  const userChat = useSelector((state) => state.chat.chat.user);

  const currentUser = userRedux?.name === props.user;
  const isUser = userRedux?.name === userChat.name;

  const left = !isUser ? userChat?.photo : freelancerRedux?.photo;

  return (
    <div className="columns mb-4">
      {!currentUser && (
        <div className="column mt-4">
          <Avatar image={getURLImage(left)} shape="circle" />
        </div>
      )}
      <div className="column is-11">
        <p>{setDateTimeString(props.date)}</p>
        <div className={"has-text-left"}>
          <div
            className="p-4"
            style={{
              background: "#eee",
              borderRadius: "5px",
              padding: "0 10px",
              // width: "50%",
              // marginLeft: currentUser ? "50%" : "0%",

              backgroundColor: currentUser ? "#0B84EE" : "#20405C",
              color: "#fff",
            }}
          >
            {/* <p style={{color: "#fff"}}>
          <strong>{props.user}</strong>:
        </p> */}

            <div className="chat-message"
              style={{ color: "#fff" }}
              dangerouslySetInnerHTML={{ __html: props.message }}
            ></div>
          </div>
        </div>
      </div>
      {currentUser && (
        <div className="column mt-4">
          <Avatar
            image={getURLImage(
              !isUser ? freelancerRedux?.photo : userRedux?.photo
            )}
            shape="circle"
          />
        </div>
      )}
    </div>
  );
};

export default Message;
