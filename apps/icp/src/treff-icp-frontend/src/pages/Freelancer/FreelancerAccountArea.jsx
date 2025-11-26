import { Menubar } from "primereact/menubar";
import { useState } from "react";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import CustomSection from "../../components/CustomSection";
import { routes } from "../../routes";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../../redux/userReducer";

const FreelancerAccountArea = (props) => {
  const navigate = useNavigate();
  const userRedux = useSelector((state) => state.user.value);
  const [user] = useState(userRedux);
  const dispatch = useDispatch();

  useEffect(() => {
    const getUserInfo = async () => {
      const userData = { ...userRedux };
      dispatch(getUser(userData.id));
    };
    getUserInfo();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const highlightElement = (e, route) => {
    navigate(route);
    let menuItems = document.getElementsByClassName("gray-back");

    for (let element of menuItems) {
      element.classList.remove("gray-back");
    }

    e.item.className = "p-menuitem-active";
    let span = e.originalEvent.target;
    span.parentElement.classList.add("gray-back");
  };

  const items = [
    {
      label: "Configuración datos básicos",
      command: (e) => {
        highlightElement(e, routes.DASHBOARD_FREELANCER_ACCOUNT_BASIC);
      },
      className: "gray-back",
      // icon: "pi pi-fw pi-power-off",
    },
    {
      label: "Cambio de contraseña",
      command: (e) => {
        highlightElement(e, routes.DASHBOARD_FREELANCER_ACCOUNT_PASSWORD);
      },

      // icon: "pi pi-fw pi-power-off",
    },
    {
      label: "Desactivar cuenta",
      command: (e) => {
        highlightElement(e, routes.DASHBOARD_FREELANCER_ACCOUNT_DESACTIVE);
      },
    },
    {
      label: "Notificaciones",
      command: (e) => {
        highlightElement(e, routes.DASHBOARD_FREELANCER_ACCOUNT_NOTIFICATIONS);
      },
      // icon: "pi pi-fw pi-power-off",
    },
  ];

  return (
    <>
      <section className={"hero is-white"}>
        <div className="hero-body pb-0 pt-0 gray">
          <Menubar model={items} />
          <CustomSection type="light">
            {/* <SectionContent type="light"> */}
            {user && <Outlet />}
            {/* </SectionContent> */}
          </CustomSection>
        </div>
      </section>
    </>
  );
};

export default FreelancerAccountArea;
