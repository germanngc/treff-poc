import BackButton from "../components/BackButton";
import CustomSection from "../components/CustomSection";
import React, { useState } from 'react';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
  };

  return (
    <CustomSection type="white">
      <BackButton />
      <div className="m-6">
        <h1>Contacto</h1>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="label">Nombre</label>
            <div className="control">
              <input
                className="input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Email</label>
            <div className="control">
              <input
                className="input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Mensaje</label>
            <div className="control">
              <textarea
                className="textarea"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>
            </div>
          </div>
          <div className="field">
            <div className="control">
              <button className="button is-primary" type="submit">
                Enviar
              </button>
            </div>
          </div>
        </form>
      </div>
    </CustomSection>
  );
};

export default Contact;
