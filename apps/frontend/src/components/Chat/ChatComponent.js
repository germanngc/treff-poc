import { Dialog } from "primereact/dialog";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getChatApi, toggleChat } from "../../redux/chatReducer";
import Chat from "./Chat";

const ChatComponent = () => {
  const chat = useSelector((state) => state.chat);
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();
  const userRedux = useSelector((state) => state.user.value);

  useEffect(() => {
    setVisible(chat.show);
  }, [chat]);

  useEffect(() => {
    const getChat = async () => {
      dispatch(
        getChatApi({
          userId: chat.currentUserId,
          freelancerId: chat.userId,
        })
      );
    };
    if (visible) {
      getChat();
    }
  }, [dispatch, chat.currentUserId, chat.userId, visible, userRedux]);

  useEffect(()=>{

  },[chat])

  return (
    <>
      {visible ? (
        <Dialog
          header="Chat"
          visible={visible}
          style={{ width: "90vw", height: "90vh" }}
          onHide={() => dispatch(toggleChat())}
          breakpoints={{ '960px': '75vw', '641px': '100vw' }}
        >
          <Chat chat={chat.chat} user={userRedux}></Chat>
        </Dialog>
      ) : (
        <div id="hidden-chat" style={{ visibility: "hidden", height: "0px" }}>
          <Chat chat={chat.chat} user={userRedux}></Chat>
        </div>
      )}
    </>
  );
};

export default ChatComponent;
