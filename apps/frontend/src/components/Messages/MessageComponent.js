import React, { useState, useEffect, useRef } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { ListBox } from "primereact/listbox";
import { Messages } from "primereact/messages";
import { Dialog } from "primereact/dialog";
import { FileUpload } from "primereact/fileupload";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { MessageApi } from "../../api";
import { useSelector } from "react-redux";
import "./MessageComponent.css"; // Archivo de estilos personalizados
import { setDateTimeString } from "../../utils/dates";
import { Avatar } from "primereact/avatar";

const MessageComponent = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileData, setFileData] = useState("");
  const [sent, setSent] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState(null);
  const userRedux = useSelector((state) => state.user.value);

  const messagesRef = useRef(null); // Referencia al componente Messages
  const fileInputRef = useRef(null); // Referencia al elemento input de tipo archivo

  // Simulación de datos de usuarios y mensajes
  useEffect(() => {
    // Obtener usuarios y mensajes desde el backend
    const fetchUserData = async () => {
      const data = await MessageApi.getUsers(userRedux.id);
      setUsers(data);
    };

    fetchUserData();
  }, [userRedux.id]);

  // Filtrar mensajes por usuario seleccionado
  const filteredMessages = messages.filter(
    (message) =>
      message.userId === selectedUser?.id ||
      message.freelancerId === selectedUser?.id
  );

  const getMessagesByUser = async (otherUserId) => {
    const response = await MessageApi.getMessagesUsers(
      userRedux.id,
      otherUserId
    );
    setMessages(response);
  };

  // Manejar selección de usuario
  const handleUserSelect = async (event) => {
    if (event.value?.id) {
      setSelectedUser(event.value);
      await getMessagesByUser(event.value.id);
    }
  };

  // Enviar nuevo mensaje
  const handleSendMessage = async () => {
    const request = {
      userId: userRedux.id,
      freelancerId: selectedUser.id,
      subject: "Nuevo mensaje",
      body: newMessage,
      fileName,
      fileData,
    };
    await MessageApi.sendMessage(request);

    await getMessagesByUser(selectedUser.id);
    setNewMessage("");
    setFileName("");
    setFileData("");
    setSent(true);
    messagesRef.current.show({
      severity: "success",
      summary: "Mensaje enviado",
      detail: "El mensaje ha sido enviado correctamente.",
    });
  };

  // Manejar el clic en el botón de adjuntar archivo
  const handleAttachmentClick = () => {
    fileInputRef.current.click();
  };

  // Manejar el cambio del archivo seleccionado
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFileName(file.name);

    const reader = new FileReader();
    reader.onloadend = () => {
      setFileData(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Mostrar el diálogo con la URL del adjunto
  const showAttachmentDialog = (attachment) => {
    setSelectedAttachment(attachment);
    setDialogVisible(true);
  };

  // Ocultar el diálogo
  const hideAttachmentDialog = () => {
    setSelectedAttachment(null);
    setDialogVisible(false);
  };

  return (
    <>
      <div className="columns">
        <div className="column is-one-quarter">
          <Card title="Usuarios" className="height-100 overflow-auto mb-6 pb-6">
            <ListBox
              options={users}
              value={selectedUser}
              optionLabel="name"
              onChange={handleUserSelect}
              filter
              filterPlaceholder="Filtrar usuarios"
              className="width-100"
              itemTemplate={(option) => (
                <div className="user-item">
                  <Avatar
                    image={`${process.env.REACT_APP_IMAGES_URL}${option.photo}`}
                    shape="circle"
                    size="large"
                    className="p-mr-2"
                  />
                  <span className="user-name">{option.name}</span>
                </div>
              )}
            />
          </Card>
        </div>
        <div className="column">
          <Card
            className="p-6 mb-6"
            title={
              selectedUser ? `Mensajes con ${selectedUser.name}` : "Mensajes"
            }
          >
            <div className="message-list height-100 overflow-auto">
              {selectedUser && filteredMessages.length > 0 ? (
                filteredMessages.map((message, index) => (
                  <div
                    key={message.messageId}
                    className={`message ${
                      message.userId === selectedUser.id
                        ? "outgoing"
                        : "incoming"
                    }`}
                  >
                    <div className="message-content">
                      <div
                        dangerouslySetInnerHTML={{ __html: message.body }}
                      ></div>
                      {index !== filteredMessages.length && (
                        <hr className="message-separator" />
                      )}
                      {message.attachments &&
                        message.attachments.map((attachment, index) => (
                          <div
                            key={attachment.attachmentId}
                            className="attachment"
                            onClick={() => showAttachmentDialog(attachment)}
                          >
                            <div
                              className="attachment-info"
                              style={{ cursor: "pointer" }}
                            >
                              <span className="attachment-icon">📎</span>
                              <span>{attachment.fileName}</span>
                            </div>
                            <div className="attachment-date">
                              {setDateTimeString(message.sentDateTime)}
                            </div>
                          </div>
                        ))}
                      {message.attachments.length === 0 && (
                        <div className="attachment">
                          <div className="attachment-info"></div>
                          <div className="attachment-date">
                            {setDateTimeString(message.sentDateTime)}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="has-text-centered">
                  {selectedUser
                    ? "No hay mensajes con este usuario."
                    : "Selecciona un usuario para ver sus mensajes."}
                </div>
              )}
            </div>
          </Card>
          {selectedUser && (
            <Card className="mt-6 mb-6" title="Nuevo mensaje">
              <div className="columns">
                <div className="column">
                  <ReactQuill
                    value={newMessage}
                    onChange={setNewMessage}
                    placeholder="Escribe tu mensaje..."
                    className="quill-editor"
                  />
                </div>
                <div className="column is-narrow">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                  <Button
                    label="Adjuntar"
                    onClick={handleAttachmentClick}
                    className="p-button-secondary"
                  />
                  {fileName && <span className="file-name">{fileName}</span>}
                </div>
              </div>
              <div className="has-text-right">
                <Button label="Enviar" onClick={handleSendMessage} />
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Diálogo para mostrar el adjunto */}
      <Dialog
        visible={dialogVisible}
        onHide={hideAttachmentDialog}
        header="Adjunto"
        className="attachment-dialog"
      >
        {selectedAttachment && (
          <div>
            <div className="attachment-filename">
              {selectedAttachment.fileName}
            </div>
            <Button
              label="Abrir adjunto"
              onClick={() =>
                window.open(
                  `${process.env.REACT_APP_IMAGES_URL}${selectedAttachment.fileName}`,
                  "_blank"
                )
              }
              className="p-button-secondary"
            />
          </div>
        )}
      </Dialog>

      <Messages ref={messagesRef}></Messages>
    </>
  );
};

export default MessageComponent;
