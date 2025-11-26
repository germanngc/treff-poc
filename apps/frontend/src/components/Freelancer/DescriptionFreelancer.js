import { Toast } from "primereact/toast";
import { useRef } from "react";
import { FreelancerApi } from "../../api";
import { useForm } from "react-hook-form";
import SectionContent from "../SectionContent";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../../redux/userReducer";

const DescriptionFreelancer = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      description: user.description,
    },
  });

  const toast = useRef(null);

  const update = async (formData) => {
    const userData = {...user};
    userData.description = formData.description;
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
              <b>Descripción</b>
            </p>
          </div>
          <form onSubmit={handleSubmit(update)}>
            <div className="card p-fluid">
              <textarea
                {...register("description", { required: true, maxLength: 2000 })}
                className="textarea"
                placeholder="Breve descripción de mi persona"
              ></textarea>
              {errors.description && <span>Este campo es requerido</span>}
            </div>
            <div className="control mt-6 has-text-centered is-mobile">
              <input
                type={"submit"}
                className="button is-success"
                style={{ width: "100%" }}
                value="Agregar"
              ></input>
            </div>
          </form>
        </div>
        <Toast ref={toast}></Toast>
      </SectionContent>
    </>
  );
};

export default DescriptionFreelancer;
