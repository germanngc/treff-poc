import { Toast } from "primereact/toast";
import { useRef } from "react";
import { FreelancerApi } from "../../api";
import { useForm } from "react-hook-form";
import SectionContent from "../SectionContent";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../../redux/userReducer";
import { Dialog } from "primereact/dialog";
import { useState } from "react";
import { getURLImage } from "../../utils/images";

const DesactiveAccount = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const toast = useRef(null);
  const [displayMessage, setDisplayMessage] = useState(false);

  const updateData = async (formData) => {
    const userData = { ...user };

    userData.active = !userData.active;

    const data = await FreelancerApi.updateFreelancer(user.id, userData);
    dispatch(addUser(data));
    setDisplayMessage(false);
    toast.current.show({
      severity: "success",
      summary: "Actualización correcta",
    });
  };

  const update = async (formData) => {
    setDisplayMessage(true);
    // const userData = { ...user };

    // userData.active = !userData.active;

    // const data = await FreelancerApi.updateFreelancer(user.id, userData);
    // dispatch(addUser(data));
    // toast.current.show({
    //   severity: "success",
    //   summary: "Actualización correcta",
    // });
  };

  return (
    <>
      <SectionContent type="light">
        {user.active ? (
          <div className="pb-6">
            <div className="has-text-centered mb-4 is-hidden-widescreen">
              <p className="p-18-dark">
                <b>Desactivar cuenta</b>
              </p>
            </div>
            <div className="has-text-left mb-4">
              <p className="text-dark mt-3">
                ¿Que sucede cuando desactivas tu cuenta?
              </p>
              <p className="mt-6">
                -Tu perfil y tus servicios ya no se mostrarian de TREFF
              </p>
              <p className="mt-6">-Los pedidos activos serán cancelados </p>
              <p className="mt-6">-No podran reactivar los servicios</p>
            </div>
            <div className="has-text-right columns">
              <div className="column has-text-right p-4">Me voy porque..</div>
              <div className="column has-text-left">
                <form onSubmit={handleSubmit(update)}>
                  <div className="field">
                    <div className="control">
                      <div className="select">
                        <select {...register("active", { required: true })}>
                          <option value={""}>Elige un motivo</option>
                          <option value={"Motivo1"}>Motivo 1</option>
                          <option value={"Motivo2"}>Motivo 2</option>
                        </select>
                      </div>
                      {errors.active && (
                        <span className="error-validation">
                          Este campo es requerido
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="control mt-6 has-text-centered">
                    <input
                      type={"submit"}
                      // onClick={() => update()}
                      className="button is-danger"
                      style={{ width: "100%" }}
                      value="Desactivar cuenta"
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>
        ) : (
          <div className="pb-6">
            <div className="has-text-centered mb-4 is-hidden-widescreen">
              <p className="p-18-dark">
                <b>Activar cuenta</b>
              </p>
            </div>
            <div className="has-text-right">
              <div className="has-text-left">
                <form onSubmit={handleSubmit(update)}>
                  <div className="control mt-6 has-text-centered">
                    <input
                      type={"submit"}
                      // onClick={() => update()}
                      className="button is-success"
                      style={{ width: "100%" }}
                      value="Activar cuenta"
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
        <Toast ref={toast}></Toast>
        <Dialog
          // header="Edita tu foto de perfil"
          visible={displayMessage}
          // style={{ width: "80vw" }}
          closable={false}
          onHide={() => setDisplayMessage(false)}
          breakpoints={{ "1024px": "75vw", "960px": "75vw", "640px": "100vw" }}
        >
          <div className="has-text-centered p-4">
            <img src={getURLImage("images/Logo Treff 5.png", true)} alt="success" />
 
            <p className="text-dark mt-6">
              <b>¿Estás seguro de {user.active ? "desactivar": "volver a activar"}</b>
            </p>
            <div className="control mt-6 has-text-centered">
              <input
                type={"submit"}
                onClick={() => updateData()}
                className="button is-primary"
                style={{ width: "100%" }}
                value="Aceptar"
              />
            </div>
            <div className="control mt-4 has-text-centered">
              <input
                type={"submit"}
                onClick={() => setDisplayMessage(false)}
                className="button is-danger"
                style={{ width: "100%" }}
                value="Cancelar"
              />
            </div>
          </div>
        </Dialog>
      </SectionContent>
    </>
  );
};

export default DesactiveAccount;
