import { Steps } from "primereact/steps";
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { routes } from "../../routes";

export const NewService = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const items = [
    {
      label: "Datos Generales",
      command: (event) => {
        navigate(routes.DASHBOARD_SERVICENEW_TITLE);
      },
    },
    {
      label: "Fijación de precios ",
      command: (event) => {
        navigate(routes.DASHBOARD_SERVICENEW_PRICE);
      },
    },
    {
      label: "FAQ",
      command: (event) => {
        navigate(routes.DASHBOARD_SERVICENEW_DESCRIPTION);
      },
    },
    {
      label: "Requerimientos",
      command: (event) => {
        navigate(routes.DASHBOARD_SERVICENEW_REQUIREMENTS);
      },
    },
    {
      label: "Galería",
      command: (event) => {
        navigate(routes.DASHBOARD_SERVICENEW_FILES);
      },
    },
    {
      label: "Publicar",
      command: (event) => {
        navigate(routes.DASHBOARD_SERVICENEW_PUBLISH);
      },
    },
  ];

  return (
    <>
      <div className="steps-demo">
        <Steps
          model={items}
          activeIndex={activeIndex}
          onSelect={(e) => setActiveIndex(e.index)}
          readOnly={false}
        />
      </div>
      <Outlet context={[activeIndex, setActiveIndex]} />
      <br/>
    </>
  );
};
