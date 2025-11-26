import { Chips } from "primereact/chips";
import { useState, useEffect } from "react";
import { FreelancerApi } from "../../api";
import SectionContent from "../SectionContent";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../../redux/userReducer";

const Skills = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);
  const skills = user ? (user.skills?.split("||") || []) : [];
  const [values1, setValues1] = useState(skills);
  const toast = useRef(null);

  // Update values1 when user data changes
  useEffect(() => {
    console.log("useEffect triggered! User changed:", user);
    if (user && user.skills) {
      console.log("Setting values1 to:", user.skills.split("||"));
      setValues1(user.skills.split("||"));
    } else {
      console.log("Setting values1 to empty array");
      setValues1([]);
    }
  }, [user]);
  const update = async () => {
    console.log("Update button clicked");
    console.log("Current values1:", values1);
    console.log("Current user:", user);
    
    const userData = {...user};
    const skills = (values1 || []).join("||");
    console.log("Skills string to save:", skills);
    userData.skills = skills;
    
    try {
      console.log("Calling API with userData:", userData);
      const data = await FreelancerApi.updateFreelancer(userData.id, userData);
      console.log("API response received in Skills:", data);
      console.log("API response type:", typeof data);
      console.log("API response is null?", data === null);
      console.log("API response is undefined?", data === undefined);
      
      if (data) {
        console.log("Dispatching addUser with data:", data);
        dispatch(addUser(data));
        console.log("addUser dispatched successfully");
        toast.current.show({
          severity: "success",
          summary: "Actualización correcta",
          //   detail: "Usuario incorrecto",
        });
      } else {
        console.error("API returned null/undefined data");
        toast.current.show({
          severity: "error",
          summary: "Error al actualizar",
          detail: "No se recibió respuesta del servidor",
        });
      }
    } catch (error) {
      console.error("Error updating skills:", error);
      console.error("Error details:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url,
        method: error.config?.method
      });
      toast.current.show({
        severity: "error",
        summary: "Error al actualizar",
        detail: error.message,
      });
    }
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
              <Chips 
                value={values1} 
                onChange={(e) => {
                  console.log("Chips onChange fired! New value:", e.value);
                  setValues1(e.value);
                }}
                onAdd={(e) => {
                  console.log("Chips onAdd fired! Item added:", e.value);
                }}
                onRemove={(e) => {
                  console.log("Chips onRemove fired! Item removed:", e.value);
                }}
                separator=","
              />
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
