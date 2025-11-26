import { useState } from "react";
import { useForm } from "react-hook-form";
import { FreelancerApi } from "../../api";
import CustomSection from "../../components/CustomSection";
import BackButton from "../../components/BackButton";
import { useLocation, useNavigate } from "react-router-dom";
import { routes } from "../../routes";
import { Menubar } from "primereact/menubar";

const NewAdminPage = () => {
  const location = useLocation();
 
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
    data.isAdmin = true;
    setIsLoading(true);
    await FreelancerApi.createFreelancer(data);
    navigate("/" + routes.DASHBOARD_ADMIN);
    // dispatch(addUser(userResponse));
    // props.onClose();
    setIsLoading(false);
  };
  return (
    <CustomSection type="white">
      <BackButton back={true} />
      <div className="m-6 has-text-justified w-full">
        <p className="subtitle-dark">Nuevo Usuario administrador</p>
        <br />
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
    </CustomSection>
  );
};

export default NewAdminPage;
