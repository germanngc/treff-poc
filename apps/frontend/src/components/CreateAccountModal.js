import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { FreelancerApi } from "../api";
import { addUser } from "../redux/userReducer";
import SocialLogin from "./SocialLogin";

const CreateAccountModal = (props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    console.log(data);
    setIsLoading(true);
    const userResponse = await FreelancerApi.createFreelancer(data);
    dispatch(addUser(userResponse));
    props.onClose();
    setIsLoading(false);
  };

  return (
    <>
      {/* <CustomSection type="white"> */}
      <div className="p-5 mb-6">
        <div className="has-text-centered">
          <img
            src={
              process.env.PUBLIC_URL + "/images/Treff_03_color_gradient 2.png"
            }
            alt="Logo"
            height={87}
            width={78}
            style={{ maxHeight: "200px" }}
            className="mb-6"
          />
        </div>
        <div className="mt-6">
          <p className="subtitle-2-dark">Registrarse</p>
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

            {/* include validation with required or other standard HTML validation rules */}
            <div className="field">
              <input
                className="input"
                placeholder="Nombre"
                {...register("name", { required: true })}
              />
              {/* errors will return when field validation fails  */}
              {errors.name && <span>Este campo es requerido</span>}
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
              <label className="radio">
                <input
                  type="radio"
                  name="answer"
                  checked
                  value={true}
                  {...register("isFreelancer")}
                />
                Freelancer
              </label>
              <label className="radio">
                <input
                  type="radio"
                  name="answer"
                  value={false}
                  {...register("isFreelancer")}
                />
                Contratar
              </label>
            </div>

            <div className="control">
              <button
                className={`button is-success is-medium is-fullwidth ${
                  isLoading ? "is-loading" : ""
                }`}
                type="submit"
                // value={"Aceptar"}
              >
                Aceptar
              </button>
            </div>
          </form>
        </div>
        {/* </CustomSection> */}
      </div>
    </>
  );
};

export default CreateAccountModal;
