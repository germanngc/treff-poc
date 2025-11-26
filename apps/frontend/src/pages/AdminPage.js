import React, { useEffect, useRef, useState } from "react";
import BackButton from "../components/BackButton";
import { FreelancerApi } from "../api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import CustomSection from "../components/CustomSection";
import { routes } from "../routes";
import { Menubar } from "primereact/menubar";

const AdminPage = () => {
  const location = useLocation();
  const highlightElement = (e, route) => {
    navigate(route);
  };
  const items = [
    {
      label: "Dashboard",
      command: (e) => {
        highlightElement(e, routes.DASHBOARD_ADMIN_NEW);
      },
      className: location.pathname.includes(routes.DASHBOARD_ADMIN_NEW)
        ? "blue-back"
        : "",
    },

    {
      label: "Mensajes",
      command: (e) => {
        highlightElement(e, routes.DASHBOARD_ADMIN_MESSAGES);
      },
      className: location.pathname.includes(routes.DASHBOARD_ADMIN_MESSAGES)
        ? "blue-back"
        : "",
      // icon: "pi pi-fw pi-power-off",
    },

    // {
    //   label: "Configuración Freelancer",
    //   // icon: "pi pi-fw pi-power-off",
    // },
    {
      label: "Freelancers",
      command: (e) => {
        highlightElement(e, routes.DASHBOARD_ADMIN_FREELANCERS);
      },
      className: location.pathname.includes(
        routes.DASHBOARD_FREELANCER_PROJECTS
      )
        ? "blue-back"
        : "",
    },
    // {
    //   label: "Servicios",
    //   command: (e) => {
    //     highlightElement(
    //       e,
    //       routes.DASHBOARD_SERVICES + "/" + routes.DASHBOARD_SERVICESACTIVE
    //     );
    //   },
    //   className: location.pathname.includes(routes.DASHBOARD_SERVICES)
    //     ? "blue-back"
    //     : "",
    // },

    {
      label: "Contratantes",
      command: (e) => {
        highlightElement(e, routes.DASHBOARD_ADMIN_CLIENTS);
      },
      className: location.pathname.includes(routes.DASHBOARD_FREELANCER_FINANCE)
        ? "blue-back"
        : "",
    },

    {
      label: "Colaboradores",
      command: (e) => {
        highlightElement(e, routes.DASHBOARD_ADMIN_COLLABORATOR);
      },
      className: location.pathname.includes(routes.DASHBOARD_FREELANCER_ACCOUNT)
        ? "blue-back"
        : "",
    },
    {
      label: "Finanzas",
      command: (e) => {
        highlightElement(e, routes.DASHBOARD_ADMIN_FINANCES);
      },
      className: location.pathname.includes(
        routes.DASHBOARD_FREELANCER_VERIFICATION
      )
        ? "blue-back"
        : "",
    },
    {
      label: "Destacados y promociones",
      command: (e) => {
        highlightElement(e, routes.DASHBOARD_ADMIN_HIGHLIGHT);
      },
      className: location.pathname.includes(
        routes.DASHBOARD_FREELANCER_VERIFICATION
      )
        ? "blue-back"
        : "",
    },
    {
      label: "Perfil",
      isFreelancer: true,
      command: (e) => {
        highlightElement(e, routes.DASHBOARD_ADMIN_PROFILE);
      },
      className: location.pathname.includes(routes.DASHBOARD_FREELANCERPROFILE)
        ? "blue-back"
        : "",
    },
  ];
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState(null);
  const toast = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getUsers = async () => {
      const users = await FreelancerApi.getAdmins();
      setUsers(users);
    };
    getUsers();
  }, []);

  const onRowEditComplete1 = async (e) => {
    // let educationsTemp = [...educations];
    const usersTemp = [...users];
    let { newData, index } = e;
    console.log(newData);
    await FreelancerApi.updateFreelancer(newData.id, newData);

    usersTemp[index] = newData;
    setUsers(usersTemp);

    // educationsTemp[index] = newData;

    // setEducations(educationsTemp);
    // await updateEducations(educationsTemp);
    toast.current.show({ severity: "success", summary: "Registro modificado" });
  };

  const textEditor = (options) => {
    return (
      <InputText
        type="text"
        value={options.value}
        onChange={(e) => options.editorCallback(e.target.value)}
      />
    );
  };

  const deleteTemplate = (rowData, column) => {
    return (
      <div>
        <Link onClick={() => confirm(rowData)}>
          <img
            src={process.env.PUBLIC_URL + "/images/delete.png"}
            width="30"
            height={"50"}
            alt="profile"
          />
        </Link>
      </div>
    );
  };

  const confirm = (rowData) => {
    // setRowToDelete(rowData);
    confirmDialog({
      message: "¿Deseas borrar este registro?",
      header: "Confirmación de borrado",
      icon: "pi pi-info-circle",
      acceptClassName: "p-button-danger",
      accept: () => rowColumnClick(rowData),
      // rowColumnClick
    });
  };

  const rowColumnClick = async (rowData) => {
    const educationsTemp = users.filter((e) => e.id !== rowData.id);

    setUsers(educationsTemp);
    const userToDelete = users.find((e) => e.id === rowData.id);
    userToDelete.isAdmin = false;
    await FreelancerApi.updateFreelancer(userToDelete.id, userToDelete);
    // updateEducations(educationsTemp);
    toast.current.show({ severity: "success", summary: "Registro borrado" });
  };

  return (
    <>
      <CustomSection type="white">
        {/* <SectionContent type="light" className="pt-1 pl-2 pb-3"> */}
        <section className="hero is-white blue">
          <Menubar
            model={
              items
              //   .filter(
              //   (i) =>
              //     i.isFreelancer === userRedux?.isFreelancer ||
              //     i.isFreelancer === undefined
              // )
            }
          />
          <div className="hero-body has-text-centered pb-0 is-light">
            <Outlet />
          </div>
        </section>
        <BackButton />

        {/* </SectionContent> */}
      </CustomSection>
    </>
  );
};

export default AdminPage;
