import React, { useRef } from "react";
import CustomSection from "../components/CustomSection";
import BackButton from "../components/BackButton";
import { useForm } from "react-hook-form";
import { MessageApi } from "../api";
import { Toast } from "primereact/toast";

const HelpCenter = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: { isFreelancer: true } });
  const toast = useRef(null);
  const onSubmit = async (data) => {
    const request = {
      name: data.name,
      email: data.email,
      subject: data.subject,
      description: data.description,
      isFreelancer: data.isFreelancer === "true",
    };
    console.log(request);
    await MessageApi.sendMail(request);
    reset({
      name: "",
      email: "",
      subject: "",
      description: "",
      isFreelancer: true,
    });
    toast.current.show({
      severity: "success",
      summary: "Mensaje enviado",
      detail: "Hemos recibido tu mensaje, te responderemos pronto.",
    });
    // setIsLoading(true);
    // const userResponse = await FreelancerApi.createFreelancer(data);
    // dispatch(addUser(userResponse));
    // props.onClose();
    // setIsLoading(false);
  };
  return (
    <CustomSection type="white">
      <BackButton />
      <div className="m-6">
        <h1>Centro de ayuda</h1>
        <p>Este es el centro de ayuda.</p>
      </div>
      <form className="pt-6 login-form mb-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="field">
          <label className="label">Nombre</label>
          <div className="control">
            <input
              {...register("name", { required: true })}
              className="input"
              type="text"
              placeholder="Text input"
            />
          </div>
        </div>

        <div className="field">
          <label className="label">Email</label>
          <div className="control">
            <input
              // className="input is-danger"
              {...register("email", { required: true })}
              className="input"
              type="email"
              placeholder="Email input"
            />
          </div>
          {/* <p className="help is-danger">This email is invalid</p> */}
        </div>

        <div className="field">
          <label className="label">Tema</label>
          <div className="control">
            <input
              // className="input is-danger"
              {...register("subject", { required: true })}
              className="input"
              type="text"
              placeholder="Email input"
            />
          </div>
          {/* <p className="help is-danger">This email is invalid</p> */}
        </div>

        <div className="field">
          <label className="label">Descripción</label>
          <textarea
            {...register("description", { required: true, maxLength: 2000 })}
            className="textarea"
            placeholder="Mensaje..."
          ></textarea>
        </div>

        <div className="field">
          <div className="control">
            <label className="radio">
              <input
                type="radio"
                value={true}
                name="isFreelancer"
                {...register("isFreelancer")}
              />
              Freelancer
            </label>
            <label className="radio">
              <input
                type="radio"
                value={false}
                name="isFreelancer"
                {...register("isFreelancer")}
              />
              Contratante
            </label>
          </div>
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button className="button is-link">Submit</button>
          </div>
          <div className="control">
            <button className="button is-link is-light">Cancel</button>
          </div>
        </div>
      </form>
      <Toast ref={toast}></Toast>
    </CustomSection>
  );
};

export default HelpCenter;
