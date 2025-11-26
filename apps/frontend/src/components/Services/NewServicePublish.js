import { useNavigate } from "react-router-dom";
import SectionContent from "../SectionContent";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { removeNewService } from "../../redux/serviceReducer";
import { routes } from "../../routes";
import { ServiceApi } from "../../api";
import { RadioButton } from "primereact/radiobutton";
import { useRef, useState } from "react";
import { Toast } from "primereact/toast";

const NewServicePublish = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const service = useSelector((state) => state.service.new);
  const userRedux = useSelector((state) => state.user.value);
  const [city, setCity] = useState(service?.isMexico !== undefined || null);
  const toast = useRef(null);
  const { handleSubmit } = useForm({
    defaultValues: {
      description: service?.description || "",
    },
  });

  const next = async (data) => {
    if (city === null) {
      return;
    }
    let serviceData = { ...service } || {};
    serviceData.freelancerId = userRedux.id;
    serviceData.isMexico = city;

    if (serviceData.id) {
      await ServiceApi.updateService(serviceData.id, serviceData);
    } else {
      await ServiceApi.createService(serviceData);
    }
    dispatch(removeNewService(serviceData));
    toast.current.show({ severity: "success", summary: "Servicio agregado" });
    navigate(
      "/" +
        routes.DASHBOARD_FREELANCER +
        "/" +
        routes.DASHBOARD_SERVICES +
        "/" +
        routes.DASHBOARD_SERVICESACTIVE
    );
  };

  return (
    <>
      <Toast ref={toast}></Toast>
      <SectionContent type="light">
        <form onSubmit={handleSubmit(next)}>
          <p className="text-dark">¡Ya casi terminas !</p>
          <p className="text-16-gray mt-4">
            Completa los siguientes requisitos para empezar a vender.
            <br />
            Asegurémonos de que está completamente calificado para ofrecer sus
            servicios con los siguientes controles.
          </p>
          <p className="text-16-gray mt-4 has-text-weight-bold">
            ¿Te encuentras ubicado en MEXICO?
          </p>
          <div className="field mt-4">
            <div
              className="field-radiobutton"
              style={{ backgroundColor: "#fff" }}
            >
              <RadioButton
                inputId="city1"
                name="city"
                value={false}
                onChange={(e) => setCity(e.value)}
                checked={city === false}
              />
              <label htmlFor="city1">
                No , Confirmo que todos los servicios que ofrezco son fuera de
                Mexico .
              </label>
            </div>
            <div
              className="field-radiobutton"
              style={{ backgroundColor: "#fff" }}
            >
              <RadioButton
                inputId="city2"
                name="city"
                value={true}
                onChange={(e) => setCity(e.value)}
                checked={city === true}
              />
              <label htmlFor="city2">
                Si, Confirmo que todos los servicios que ofrezco son dentro de
                Mexico.
              </label>
            </div>
            {city === null && (
              <span className="error-validation">Este campo es requerido</span>
            )}
          </div>

          <div className="control mt-6 has-text-centered">
            <input
              type={"submit"}
              className="button is-success"
              style={{ width: "100%" }}
              value="Guardar y continuar"
            />
          </div>
        </form>
      </SectionContent>
    </>
  );
};

export default NewServicePublish;
