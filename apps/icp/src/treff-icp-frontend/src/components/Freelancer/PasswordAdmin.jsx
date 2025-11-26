import { Toast } from "primereact/toast";
import { useRef } from "react";
import { FreelancerApi } from "../../api";
import { useForm } from "react-hook-form";
import SectionContent from "../SectionContent";
import { useDispatch, useSelector } from "react-redux";
import { Dialog } from "primereact/dialog";
import { useState } from "react";
import { getURLImage } from "../../utils/images";
import { removeUser } from "../../redux/userReducer";

const PasswordAdmin = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const toast = useRef(null);
  const [displayMessage, setDisplayMessage] = useState(false);

  const update = async (formData) => {
    const request = {
      id: user.id,
      newPassword: formData.password1,
      password: formData.password,
    };

    const data = await FreelancerApi.updatePassword(request);
    // dispatch(addUser(data));

    if (data.success) {
      reset();
      setDisplayMessage(true);
    } else {
      toast.current.show({
        severity: data.success ? "success" : "error",
        summary: data.message,
      });
    }
  };

  const deleteSession = () =>{
    dispatch(removeUser());
  }

  return (
    <>
      <SectionContent type="light">
        <div className="pb-6">
          <div className="has-text-centered mb-4 is-hidden-widescreen">
            <p className="p-18-dark">
              <b>Cambio de contraseña</b>
            </p>
          </div>
          <form onSubmit={handleSubmit(update)}>
            <div className="field">
              <label className="label">Contraseña actual</label>
              <div className="control">
                <input
                  {...register("password", { required: true })}
                  className="input"
                  type="password"
                  placeholder=""
                />
                {errors.password && (
                  <span className="error-validation">
                    Este campo es requerido
                  </span>
                )}
              </div>
            </div>

            <div className="field">
              <label className="label">Contraseña nueva</label>
              <div className="control">
                <input
                  {...register("password1", {
                    required: true,
                  })}
                  className="input"
                  type="password"
                  placeholder=""
                />
                {errors.password1 && (
                  <span className="error-validation">
                    Este campo no tiene el formato correcto
                  </span>
                )}
              </div>
            </div>

            <div className="field">
              <label className="label">Repetir Contraseña</label>
              <div className="control">
                <input
                  {...register("password2", {
                    required: "Este campo es requerido",
                    validate: (val) => {
                      if (watch("password1") !== val) {
                        return "Tus contraseñas no coinciden";
                      }
                    },
                  })}
                  className="input"
                  type="password"
                  placeholder=""
                />
                {errors.password2 && (
                  <span className="error-validation">
                    {errors.password2?.message}
                  </span>
                )}
              </div>
            </div>

            <div className="control mt-6 has-text-centered">
              <input
                type={"submit"}
                // onClick={() => update()}
                className="button is-success"
                style={{ width: "100%" }}
                value="Actualizar Datos"
              />
            </div>
          </form>
        </div>
        <Toast ref={toast}></Toast>
      </SectionContent>
      <Dialog
        // header="Edita tu foto de perfil"
        visible={displayMessage}
        // style={{ width: "80vw" }}
        closable={false}
        onHide={() => setDisplayMessage(false)}
        breakpoints={{ "1024px": "75vw", "960px": "75vw", "640px": "100vw" }}
      >
        <div className="has-text-centered p-4">
          <img src={getURLImage("images/success.png", true)} alt="success" />
          <p className="subtitle-dark mt-4">
            Confirmación cambio de contraseña{" "}
          </p>
          <p className="text-dark mt-4">
            Tu cambio de contraseña se realizo con exito .
          </p>
          <p className="text-dark mt-6">
            <b>Te envitamos a que inicies sesion nuevamente</b>
          </p>
          <div className="control mt-6 has-text-centered">
            <input
              type={"submit"}
              onClick={() => deleteSession()}
              className="button is-primary"
              style={{ width: "100%" }}
              value="Iniciar sesión"
            />
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default PasswordAdmin;
