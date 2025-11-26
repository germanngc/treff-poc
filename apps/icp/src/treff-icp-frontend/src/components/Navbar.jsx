import React, { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { routes } from "../routes";
import { Dialog } from "primereact/dialog";
import CreateAccountModal from "./CreateAccountModal";
import LoginModal from "./LoginModal";
import { OverlayPanel } from "primereact/overlaypanel";
import { Avatar } from "primereact/avatar";
import { Menu } from "primereact/menu";
import { getURLImage } from "../utils/images";
import { useDispatch, useSelector } from "react-redux";
import { addUser, removeUser } from "../redux/userReducer";
import { Notifications } from "./Notifications/Notifications";
import { Badge } from "primereact/badge";
import {
  addLastNotifications,
  readNotifications,
} from "../redux/notificationReducer";
import { FreelancerApi, NotificationApi } from "../api";
import NotificationsPanel from "./Notifications/NotificationsPanel";
import { AuthClient } from "@dfinity/auth-client";

export default function Navbar(props) {
  const dispatch = useDispatch();
  const [isActive, setIsActive] = React.useState(false);
  const [visibleCreate, setVisibleCreate] = React.useState(false);
  const [visibleLogin, setVisibleLogin] = React.useState(false);
  // const [user, setUser] = React.useState(false);
  const userRedux = useSelector((state) => state.user.value);
  const [userData, setUserData] = React.useState(userRedux);
  const notificationsRedux = useSelector(
    (state) => state.notification.notifications
  );
  const [notifications, setNotifications] = React.useState(notificationsRedux);

  const clickMenuHandler = () => {
    setIsActive(!isActive);
  };

  useEffect(() => {
    const getUser = () => {
      setUserData(userRedux);
    };
    getUser();
  }, [userRedux]);

  useEffect(() => {
    const getUser = () => {
      setNotifications(notificationsRedux);
    };
    getUser();
  }, [notificationsRedux]);

  const op = useRef(null);
  const opNotifications = useRef(null);
  const menu = useRef(null);
  const navigate = useNavigate();

  const profileOption = (text, image, target, action) => {
    return (
      <Link
        to={target}
        onClick={() => action()}
        className="p-18-dark is-vcentered"
      >
        <div className="columns is-mobile">
          <div className="column is-2">
            {image && (
              <img src={image} alt="profile" />
            )}
          </div>
          <div className="column pt-3">
            <p className="p-18-black">{text}</p>
          </div>
        </div>
      </Link>
    );
  };

  const menuProfile = [
    userRedux?.isFreelancer && {
      text: "Perfil",
      image: "/images/profile.svg",
      isFreelancer: true,
      target:
        routes.DASHBOARD_FREELANCER +
        "/" +
        routes.DASHBOARD_FREELANCERPROFILE +
        "/" +
        routes.DASHBOARD_FREELANCERDESCRIPTION,
      action: () => {
        clickMenuHandler();
        op.current.toggle();
      },
    },
    {
      text: "Dashboard",
      image: "/images/dashboard.svg",
      target: "",
    },
    // {
    //   text: "Configuración Freelancer",
    //   image: "/images/configFreelancer.svg",
    //   target: "",
    // },
    {
      text: "Proyectos",
      image: "/images/project.svg",
      target:
        routes.DASHBOARD_FREELANCER +
        "/" +
        routes.DASHBOARD_FREELANCER_PROJECTS +
        "/" +
        routes.DASHBOARD_FREELANCER_PROJECTS_CONTRACTED,
      action: () => {
        clickMenuHandler();
        op.current.toggle();
      },
    },
    {
      text: "Servicios",
      image: "/images/services.svg",
      target:
        routes.DASHBOARD_FREELANCER +
        "/" +
        routes.DASHBOARD_SERVICES +
        "/" +
        routes.DASHBOARD_SERVICESACTIVE,
      action: () => {
        clickMenuHandler();
        op.current.toggle();
      },
    },
    {
      text: "Configuración de cuenta",
      image: "/images/configIcon.svg",
      target:
        routes.DASHBOARD_FREELANCER +
        "/" +
        routes.DASHBOARD_FREELANCER_ACCOUNT +
        "/" +
        routes.DASHBOARD_FREELANCER_ACCOUNT_BASIC,
      action: () => {
        clickMenuHandler();
        op.current.toggle();
      },
    },
    {
      text: "Verificar cuenta",
      image: "/images/userIcon.svg",
      target:
        routes.DASHBOARD_FREELANCER +
        "/" +
        routes.DASHBOARD_FREELANCER_VERIFICATION +
        "/" +
        routes.DASHBOARD_FREELANCER_VERIFICATION_PHONE,
      action: () => {
        clickMenuHandler();
        op.current.toggle();
      },
    },
    {
      text: "Dashboard Admin",
      image: "/images/dashboard.svg",
      isAdmin: true,
      target: routes.DASHBOARD_ADMIN + "/" + routes.DASHBOARD_ADMIN_NEW,
      action: () => {
        clickMenuHandler();
        op.current.toggle();
      },
    },
    {
      text: "Cerrar sesión",
      image: "",
      target: "",
      action: () => {
        setUserData(null);
        localStorage.clear();
        clickMenuHandler();
        dispatch(removeUser(userData.id));
        navigate(routes.HOME);
        try {
          op.current.toggle();
        } catch {}
      },
    },
  ];

  const createMenuProfile = () => {
    return (
      <ul className="menu-list">
        {menuProfile.map((o, i) => {
          if (o?.isAdmin && userRedux?.isAdmin) {
            return (
              <li key={i}>
                {profileOption(o?.text, o?.image, o?.target, o?.action)}
              </li>
            );
          } else if (!o?.isAdmin) {
            if (o?.isFreelancer && userRedux?.isFreelancer) {
              return (
                <li key={i}>
                  {profileOption(o?.text, o?.image, o?.target, o?.action)}
                </li>
              );
            } else if (!o?.isFreelancer) {
              return (
                <li key={i}>
                  {profileOption(o?.text, o?.image, o?.target, o?.action)}
                </li>
              );
            }
          }
        })}
      </ul>
    );
  };

  let items = [
    {
      label: "Options",
      items: [
        {
          label: "New",
          icon: "pi pi-fw pi-plus",
          command: () => {
            window.location.hash = "/fileupload";
          },
        },
        {
          label: "Delete",
          icon: "pi pi-fw pi-trash",
          url: "http://primetek.com.tr",
        },
      ],
    },
    {
      label: "Account",
      items: [
        {
          label: "Options",
          icon: "pi pi-fw pi-cog",
          command: () => {
            window.location.hash = "/";
          },
        },
        { label: "Sign Out", icon: "pi pi-fw pi-power-off" },
      ],
    },
  ];

  const onCloseLogin = () => {
    setVisibleLogin(false);
    clickMenuHandler();
  };

  const loginDefinity = async () => {
    const authClient = await AuthClient.create();
    authClient.login({
      identityProvider: "https://identity.ic0.app/",
      onSuccess: async () => {
        const identity = authClient.getIdentity();
        const principal = identity.getPrincipal().toText();
        console.log(principal);

        const user = await FreelancerApi.getFreelancerByPrincipal(principal);
        dispatch(addUser(user));
        localStorage.setItem("user", JSON.stringify(user));
        setUserData(user);
        setVisibleLogin(false);
      },
    });
  };

  return (
    <>
      <nav
        className="navbar is-fixed-top"
        role="navigation"
        aria-label="main navigation"
        style={{ height: "64px" }}
      >
        <div className="navbar-brand">
          <Link
            className="navbar-item"
            to={routes.HOME}
            onClick={() => setIsActive(false)}
          >
            <img
              src={
                "/images/Treff_01_color_gradient-2.png"
              }
              alt="Logo"
              className="img-logo ml-2 ml-0-is-mobile"
              style={{ maxHeight: "200px !important", marginRight: "40px" }}
            />
          </Link>
          <Notifications />
          <Link
            // href={() => false}
            role="button"
            className="navbar-burger"
            aria-label="menu"
            aria-expanded="false"
            data-target="navMenu"
            onClick={() => clickMenuHandler()}
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </Link>
        </div>

        <div
          id="navMenu"
          className={`navbar-menu ${isActive ? "is-active" : ""}`}
        >
          <div className="navbar-start">
            <Link
              to={routes.EXPLORE}
              className="navbar-item"
              onClick={() => clickMenuHandler()}
            >
              Explora
            </Link>
            <Link
              to={routes.ABOUT_US}
              className="navbar-item"
              onClick={() => clickMenuHandler()}
            >
              Sobre Treff
            </Link>
            <Link
              to={routes.HELP_CENTER}
              className="navbar-item"
              onClick={() => clickMenuHandler()}
            >
              Centro de ayuda
            </Link>
          </div>
          {userData ? (
            <div className="navbar-end">
              <Link
                className="navbar-item"
                to={
                  routes.DASHBOARD_FREELANCER +
                  "/" +
                  routes.DASHBOARD_SERVICES +
                  "/" +
                  routes.DASHBOARD_SERVICESACTIVE
                }
                // onClick={() => setVisibleLogin(true)}
              >
                <img
                  src={
                    "/images/Treff_06_color_solid_darkBlue.png"
                  }
                  alt="logo"
                  style={{ height: "20px", marginRight: "10px" }}
                />
                Publicar servicio
              </Link>
              <Link
                className="navbar-item  is-vcentered"
                onClick={(e) => {
                  dispatch(addLastNotifications(notifications));
                  dispatch(readNotifications());
                  NotificationApi.clearNotificationsByFreelancerId(
                    userRedux.id
                  );
                  opNotifications.current.toggle(e);
                }}
              >
                <i
                  className="pi pi-bell p-overlay-badge"
                  style={{ fontSize: "1.5rem" }}
                >
                  {notifications?.length > 0 && (
                    <Badge value={notifications?.length}></Badge>
                  )}
                </i>
              </Link>
              <Link
                className="navbar-item  is-vcentered"
                onClick={(e) => {
                  // try {
                  op.current.toggle(e);
                  // } catch {}
                }}
              >
                {userData.name}
                <Avatar
                  image={
                    userData?.photo
                      ? getURLImage(userData?.photo)
                      : getURLImage("images/user_undefined.png", true)
                  }
                  // size="large"
                  shape="circle"
                  className="ml-4"
                />
              </Link>
            </div>
          ) : (
            <div className="navbar-end">
              <Link
                className="navbar-item"
                // to={
                //   routes.DASHBOARD_FREELANCER +
                //   "/" +
                //   routes.DASHBOARD_SERVICES +
                //   "/" +
                //   routes.DASHBOARD_SERVICESACTIVE
                // }
                onClick={() => setVisibleLogin(true)}
              >
                <img
                  src={
                    "/images/Treff_06_color_solid_darkBlue.png"
                  }
                  alt=""
                  style={{ height: "20px", marginRight: "10px" }}
                />
                Publicar servicio
              </Link>
              <Link
                className="navbar-item"
                // onClick={() => setVisibleLogin(true)}
                onClick={() => {
                  loginDefinity();
                }}
              >
                Iniciar sesión
              </Link>
              <div className="navbar-item">
                <div className="buttons">
                  <button
                    className="button is-link size-18"
                    onClick={() => setVisibleCreate(true)}
                  >
                    Crea tu cuenta
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
      {/* {!isActive && (
        <section
          id="top"
          className={`navbar is-hidden-desktop is-link`}
          style={{ height: "30px", minHeight: "30px" }}
        ></section>
      )} */}

      <Dialog
        visible={visibleCreate}
        onHide={() => setVisibleCreate(false)}
        breakpoints={{ "960px": "75vw", "640px": "100vw" }}
        // style={{ width: "50vw" }}
      >
        <CreateAccountModal onClose={() => setVisibleCreate(false)} />
      </Dialog>

      <Dialog
        visible={visibleLogin}
        onHide={() => setVisibleLogin(false)}
        breakpoints={{ "1024px": "75vw", "960px": "75vw", "640px": "100vw" }}
        // style={{ width: "50vw" }}
      >
        <LoginModal onClose={() => onCloseLogin()} />
      </Dialog>

      <OverlayPanel
        ref={op}
        id="overlay_panel1"
        style={{ width: "305px", backgroundColor: "#fff" }}
        className="overlaypanel-demo"
      >
        <div className="container is-vcentered">
          <div className="columns mb-0">
            <div className="column is-2 pb-1">
              <Avatar
                image={
                  userData?.photo
                    ? getURLImage(userData?.photo)
                    : getURLImage("images/user_undefined.png", true)
                }
                shape="circle"
              />
            </div>
            <div className="column pt-4 pb-1">
              <p className="p-18-black">{userData?.name}</p>
            </div>
          </div>
          <hr className="mt-0 mb-2" style={{backgroundColor: "#fff"}} />
          {createMenuProfile()}
        </div>
      </OverlayPanel>
      <OverlayPanel
        ref={opNotifications}
        id="overlay_panel"
        style={{ width: "405px" }}
        className="overlaypanel-demo"
      >
        <NotificationsPanel onClose={(e) => opNotifications.current.toggle()} />
      </OverlayPanel>
      <Menu model={items} popup ref={menu} id="popup_menu" />
    </>
  );
}
