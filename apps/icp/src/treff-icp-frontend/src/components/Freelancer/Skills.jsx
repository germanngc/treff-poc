import { Chips } from "primereact/chips";
import { useState } from "react";
import { FreelancerApi } from "../../api";
import SectionContent from "../SectionContent";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../../redux/userReducer";

const Skills = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);
  const skills = user ? user.skills?.split("||") : [];
  const [values1, setValues1] = useState(skills);
  const toast = useRef(null);
  const update = async () => {
    const userData = {...user};
    const skills = values1.join("||");
    userData.skills = skills;
    const data = await FreelancerApi.updateFreelancer(userData.id, userData);
    dispatch(addUser(data));
    toast.current.show({
      severity: "success",
      summary: "Actualización correcta",
      //   detail: "Usuario incorrecto",
    });
  };

  return (
    <>
      {user && (
        <SectionContent type="light">
          <div className="pb-6">
            <div className="has-text-centered mb-4 is-hidden-widescreen mb-4">
              <p className="p-18-dark">
                <b>Habilidades</b>
              </p>
            </div>
            <p className="text-16-gray mb-4">Selecciona tus habilidades</p>
            <div className="card p-fluid">
              <Chips value={values1} onChange={(e) => setValues1(e.value)} />
            </div>
            <div className="control mt-6 has-text-centered">
              <button
                onClick={() => update()}
                className="button is-success"
                style={{ width: "100%" }}
              >
                Agregar
              </button>
            </div>
          </div>
          <Toast ref={toast}></Toast>
        </SectionContent>
      )}
    </>
  );
};

export default Skills;
