import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { FreelancerApi } from "../api";
import { Toast } from "primereact/toast";
import { useDispatch } from "react-redux";
import { addUser } from "../redux/userReducer";
import SocialLogin from "./SocialLogin";

const LoginModal = (props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [isLoading, setIsLoading] = useState(false);
  const toast = useRef(null);
  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const userResponse = await FreelancerApi.loginFreelancer(data);
      dispatch(addUser(userResponse));
      setIsLoading(false);
      toast.current.show({
        severity: "success",
        summary: "Bienvenido",
        detail: userResponse.name,
      });
      props.onClose();
    } catch (e) {
      setIsLoading(false);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Usuario incorrecto",
      });
    }
  };

  return (
    <>
      {/* <CustomSection type="white"> */}
      <div className="p-5 mb-6">
        <div className="has-text-centered">
          <img
            src={
              "/images/Treff_03_color_gradient 2.png"
            }
            alt="Logo"
            height={87}
            width={78}
            style={{ maxHeight: "200px" }}
            className="mb-6"
          />
        </div>
        <div className="mt-6">
          <p className="subtitle-2-dark">Inicia sesión</p>
          <br />
          <SocialLogin onClose={props.onClose}></SocialLogin>

          <form className="pt-6 login-form" onSubmit={handleSubmit(onSubmit)}>
            {/* register your input into the hook by invoking the "register" function */}
            <div className="field">
              <input
                className="input"
                {...register("mail", { required: true })}
                placeholder="Introduce tu correo electrónico"
              />
              {errors.mail && <span>Este campo es requerido</span>}
            </div>

            <div className="field">
              <input
                className="input"
                placeholder="Constraseña"
                type={"password"}
                {...register("password", { required: true })}
              />
              {/* errors will return when field validation fails  */}
              {errors.password && <span>Este campo es requerido</span>}
            </div>
            <div className="control">
              <button
                className={`button is-success is-medium is-fullwidth ${
                  isLoading ? "is-loading" : ""
                }`}
                type="submit"
              >
                Continuar
              </button>
            </div>
          </form>
        </div>
        {/* </CustomSection> */}
      </div>
      <Toast ref={toast}></Toast>
    </>
  );
};

export default LoginModal;
