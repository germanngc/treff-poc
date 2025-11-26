import { Toast } from "primereact/toast";
import { useRef } from "react";
import { FreelancerApi } from "../../api";
import { useForm } from "react-hook-form";
import SectionContent from "../SectionContent";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../../redux/userReducer";
import countryCodes from "../../utils/CountryCodes.json";

const BasicData = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user.name,
      phone: user.phone,
      phoneCode: user.phoneCode,
      mail: user.mail,
    },
  });

  const toast = useRef(null);

  const update = async (formData) => {
    const userData = { ...user };
    userData.name = formData.name;
    userData.phone = formData.phone;
    userData.phoneCode = formData.phoneCode;
    userData.mail = formData.mail;
    const data = await FreelancerApi.updateFreelancer(userData.id, userData);
    dispatch(addUser(data));
    toast.current.show({
      severity: "success",
      summary: "Actualización correcta",
    });
  };

  return (
    <>
      <SectionContent type="light">
        <div className="pb-6">
          <div className="has-text-centered mb-4 is-hidden-widescreen">
            <p className="p-18-dark">
              <b>Configuración datos básicos</b>
            </p>
          </div>
          <form onSubmit={handleSubmit(update)}>
            <div className="field">
              <label className="label">Username</label>
              <div className="control">
                <input
                  {...register("name", { required: true })}
                  className="input"
                  type="text"
                  placeholder="Username"
                />
                {errors.name && (
                  <span className="error-validation">
                    Este campo es requerido
                  </span>
                )}
              </div>
            </div>

            <div className="field">
              <label className="label">Correo</label>
              <div className="control">
                <input
                  {...register("mail", {
                    required: true,
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: "Ingrese un formato correcto",
                    },
                  })}
                  className="input"
                  type="text"
                  placeholder="Correo"
                />
                {errors.mail && (
                  <span className="error-validation">
                    Este campo no tiene el formato correcto
                  </span>
                )}
              </div>
            </div>

            <div className="field">
              <label className="label">Teléfono</label>
              <div className="control">
                <div className="select">
                  <select {...register("phoneCode", { required: true })}>
                    <option value={""}>Lada del país</option>
                    {countryCodes.map((code, i) => (
                      <option key={i} value={code.dial_code}>
                        {code.name}({code.dial_code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="control">
                <input
                  {...register("phone", { required: true })}
                  className="input"
                  type="text"
                  placeholder="Teléfono"
                />
                {errors.phone && (
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
                className="button is-success"
                style={{ width: "100%" }}
                value="Actualizar Datos"
              />
            </div>
          </form>
        </div>
        <Toast ref={toast}></Toast>
      </SectionContent>
    </>
  );
};

export default BasicData;
