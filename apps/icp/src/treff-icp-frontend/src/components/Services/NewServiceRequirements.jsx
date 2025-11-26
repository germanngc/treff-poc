import { useNavigate, useOutletContext } from "react-router-dom";
import SectionContent from "../SectionContent";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { addNewService } from "../../redux/serviceReducer";
import { routes } from "../../routes";
import { Editor } from "primereact/editor";
import { useState } from "react";

const NewServiceRequirements = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const service = useSelector((state) => state.service.new);
  // eslint-disable-next-line no-unused-vars
  const [activeIndex, setActiveIndex] = useOutletContext();
  const [requirements, setRequirements] = useState(service?.requirements || "");

  const { handleSubmit } = useForm({
    defaultValues: {
      requirements: service?.requirements || "",
    },
  });

  const next = (data) => {
    if (!requirements) {
      return null;
    }
    let serviceData = { ...service } || {};
    serviceData.requirements = requirements;

    dispatch(addNewService(serviceData));
    setActiveIndex(4);
    navigate(
      "/" +
        routes.DASHBOARD_FREELANCER +
        "/" +
        routes.DASHBOARD_SERVICENEW +
        "/" +
        routes.DASHBOARD_SERVICENEW_FILES
    );
  };

  return (
    <>
      <SectionContent type="light">
        <form onSubmit={handleSubmit(next)}>
          <p className="text-dark mb-4">Requerimientos</p>
          <p className="text-16-gray mb-4">
            Obtenga toda la información que necesita de los compradores para
            comenzar.
          </p>
          <Editor
            style={{ height: "320px" }}
            value={requirements}
            onTextChange={(e) => setRequirements(e.htmlValue)}
            placeholder="
            Solicite los detalles necesarios, como dimensiones, marca, pautas y más."
          />
          {!requirements && (
            <span className="error-validation">Este campo es requerido</span>
          )}

          <div className="control mt-6 has-text-centered">
            <input
              type={"submit"}
              className="button is-success"
              style={{ width: "100%" }}
              value="Guardar y continuar"
            />
          </div>

          {/* <button onClick={() => setActiveIndex(1)}>Next</button> */}
        </form>
      </SectionContent>
    </>
  );
};

export default NewServiceRequirements;
