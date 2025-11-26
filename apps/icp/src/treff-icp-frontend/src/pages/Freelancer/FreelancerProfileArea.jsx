import { Menubar } from "primereact/menubar";
import { useState } from "react";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import CustomSection from "../../components/CustomSection";
import { routes } from "../../routes";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../../redux/userReducer";

const FreelancerProfileArea = (props) => {
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
      label: "Descripción",
      command: (e) => {
        highlightElement(e, routes.DASHBOARD_FREELANCERDESCRIPTION);
      },
      className: "gray-back",
    },
    {
      label: "¿Por qué yo?",
      command: (e) => {
        highlightElement(e, routes.DASHBOARD_FREELANCERWHYME);
      },
      // icon: "pi pi-fw pi-power-off",
    },
    {
      label: "Habilidades",
      command: (e) => {
        highlightElement(e, routes.DASHBOARD_FREELANCERSKILLS);
      },
    },

    {
      label: "Educación",
      command: (e) => {
        highlightElement(e, routes.DASHBOARD_FREELANCEREDUCATION);
      },

      // icon: "pi pi-fw pi-power-off",
    },
    {
      label: "Certificación",
      command: (e) => {
        highlightElement(e, routes.DASHBOARD_FREELANCERCERTIFICATION);
      },
    },
    {
      label: "Idiomas",
      command: (e) => {
        highlightElement(e, routes.DASHBOARD_FREELANCERLANGUAGE);
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

export default FreelancerProfileArea;
