import { Menubar } from "primereact/menubar";
// import { useState } from "react";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import CustomSection from "../../components/CustomSection";
import { routes } from "../../routes";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../../redux/userReducer";

const FreelancerProjectArea = (props) => {
  const navigate = useNavigate();
  const userRedux = useSelector((state) => state.user.value);
  // const [user] = useState(userRedux);
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
      label: "Proyectos contratados",
      command: (e) => {
        highlightElement(e, routes.DASHBOARD_FREELANCER_PROJECTS_CONTRACTED);
      },
      className: "gray-back",
      isFreelancer: false,
    },
    {
      label: "Proyectos en proceso",
      command: (e) => {
        highlightElement(e, routes.DASHBOARD_FREELANCER_PROJECTS_INPROGRESS);
      },
      isFreelancer: true,
    },
    {
      label: "Completados",
      command: (e) => {
        highlightElement(e, routes.DASHBOARD_FREELANCER_PROJECTS_FINISHED);
      },
    },
    {
      label: "Cancelados",
      command: (e) => {
        highlightElement(e, routes.DASHBOARD_FREELANCER_PROJECTS_CANCELLED);
      },
    },
  ];

  return (
    <>
      {/* <section className={"hero is-white"}>
        <div className="hero-body pb-0 pt-0 gray"> */}
      <div className="gray">
        <Menubar model={items.filter(i => i.isFreelancer === userRedux?.isFreelancer || i.isFreelancer === undefined)} />
      </div>
      <CustomSection type="light">
        <Outlet />
      </CustomSection>
      {/* </div>
      </section> */}
    </>
  );
};

export default FreelancerProjectArea;
