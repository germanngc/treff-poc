import { Avatar } from "primereact/avatar";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CustomSection from "../../components/CustomSection";
import { routes } from "../../routes";
import { setDateString } from "../../utils/dates";
import { getURLImage } from "../../utils/images";
import { Menubar } from "primereact/menubar";
import { Outlet } from "react-router-dom";
// import treffWaves from "../../assets/images/treff_waves.png";
import { useDispatch, useSelector } from "react-redux";
import { useRef } from "react";
import { useState } from "react";
import ImageEditor from "../../components/ImageEditor";
import { Dialog } from "primereact/dialog";
import { FreelancerApi } from "../../api";
import { addUser, updateUser } from "../../redux/userReducer";
import { Toast } from "primereact/toast";
import { getUser } from "../../redux/serviceReducer";
import { Switch } from "@mui/material";

const DashboardFreelancerProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useRef(null);
  const userRedux = useSelector((state) => state.user.value);
  const user = { ...userRedux };
  const inputFile = useRef(null);
  const inputFileCover = useRef(null);
  const [profilePhoto, setProfilePhoto] = useState();
  const [coverPhoto, setCoverPhoto] = useState();
  const [displayProfileImage, setDisplayProfileImage] = useState(false);
  const [displayCoverImage, setDisplayCoverImage] = useState(false);
  const coverUrl = user?.cover
    ? getURLImage(user.cover)
    : getURLImage("images/treff_waves.png", true);
  useEffect(() => {
    const checkUser = () => {
      const user = { ...userRedux };
      if (!user.id) {
        navigate(routes.HOME);
      }
    };
    checkUser();
  }, [userRedux, navigate]);

  useEffect(() => {
    const getUserInfo = async () => {
      const userData = { ...userRedux };
      if (userData) {
        dispatch(getUser(userData.id));
      }
    };
    getUserInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const highlightElement = (e, route) => {
    // let menuItems = document.getElementsByClassName("blue-back");

    // for (let element of menuItems) {
    //   element.classList.remove("blue-back");
    // }

    // e.item.className = "p-menuitem-active";
    // let span = e.originalEvent.target;
    // // navigate(routes.DASHBOARD_FREELANCERSKILLS);
    // span.classList.add("blue-back-text");
    // span.parentElement.classList.add("blue-back");
    navigate(route);
  };

  const items = [
    {
      label: "Dashboard",
      command: (e) => {
        highlightElement(e, routes.DASHBOARD_FREELANCER_PROJECTS);
      },
      className: location.pathname.includes(
        routes.DASHBOARD_FREELANCER_PROJECTS
      )
        ? "blue-back"
        : "",
    },

    {
      label: "Mensajes",
      command: (e) => {
        highlightElement(e, routes.DASHBOARD_FREELANCER_MESSAGES);
      },
      // icon: "pi pi-fw pi-power-off",
    },

    // {
    //   label: "Configuración Freelancer",
    //   // icon: "pi pi-fw pi-power-off",
    // },
    {
      label: !userRedux?.isFreelancer ? "Proyectos" : "Servicios",
      command: (e) => {
        highlightElement(
          e,
          routes.DASHBOARD_FREELANCER_PROJECTS +
            "/" +
            routes.DASHBOARD_FREELANCER_PROJECTS_CONTRACTED
        );
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
      label: "Finanzas",
      command: (e) => {
        highlightElement(e, routes.DASHBOARD_FREELANCER_FINANCE);
      },
      className: location.pathname.includes(routes.DASHBOARD_FREELANCER_FINANCE)
        ? "blue-back"
        : "",
    },
    {
      label: "Perfil",
      isFreelancer: true,
      command: (e) => {
        highlightElement(
          e,
          routes.DASHBOARD_FREELANCERPROFILE +
            "/" +
            routes.DASHBOARD_FREELANCERDESCRIPTION
        );
      },
      className: location.pathname.includes(routes.DASHBOARD_FREELANCERPROFILE)
        ? "blue-back"
        : "",
    },
    {
      label: "Mi cuenta",
      command: (e) => {
        highlightElement(
          e,
          routes.DASHBOARD_FREELANCER_ACCOUNT +
            "/" +
            routes.DASHBOARD_FREELANCER_ACCOUNT_BASIC
        );
      },
      className: location.pathname.includes(routes.DASHBOARD_FREELANCER_ACCOUNT)
        ? "blue-back"
        : "",
    },
    {
      label: "Verificación",
      command: (e) => {
        highlightElement(
          e,
          routes.DASHBOARD_FREELANCER_VERIFICATION +
            "/" +
            routes.DASHBOARD_FREELANCER_VERIFICATION_PHONE
        );
      },
      className: location.pathname.includes(
        routes.DASHBOARD_FREELANCER_VERIFICATION
      )
        ? "blue-back"
        : "",
    },
  ];

  const onCameraClick = () => {
    // `current` points to the mounted file input element
    inputFile.current.click();
  };
  const onCameraCoverClick = () => {
    // `current` points to the mounted file input element
    inputFileCover.current.click();
  };

  const onChangeFile = (e) => {
    e.stopPropagation();
    e.preventDefault();
    var file = e.target.files[0];
    // console.log(file);
    if (e.target.files.length > 0) {
      setProfilePhoto(file);
      setDisplayProfileImage(true);
    }
    // this.setState({file}); /// if you want to upload latter
  };

  const onChangeFileCover = (e) => {
    e.stopPropagation();
    e.preventDefault();
    var file = e.target.files[0];
    console.log(file);
    if (e.target.files.length > 0) {
      setCoverPhoto(file);
      setDisplayCoverImage(true);
    }
    // this.setState({file}); /// if you want to upload latter
  };

  const photo = () => {
    return (
      <>
        <span
          title="Actualizar photo de perfil"
          className="custom-badge"
          onClick={() => onCameraClick()}
        >
          <span className="p-badge p-component p-badge-lg">
            <img src={getURLImage("images/camera.svg", true)} alt="camera" />
          </span>
          <input
            type="file"
            id="file"
            ref={inputFile}
            style={{ display: "none" }}
            onChange={onChangeFile}
          />
        </span>
      </>
    );
  };

  const saveProfilePhoto = async (base64) => {
    const request = {
      id: user.id,
      photo: base64,
      fileName: profilePhoto.name,
      profile: true,
    };

    const response = await FreelancerApi.updatePhoto(request);
    dispatch(addUser(response));
    setDisplayProfileImage(false);
    toast.current.show({
      severity: "success",
      summary: "Operación correcta",
      detail: "La imagen se ha actualizado correctamente",
      life: 3000,
    });
  };

  const saveCoverPhoto = async (base64) => {
    const request = {
      id: user.id,
      photo: base64,
      fileName: coverPhoto.name,
      cover: true,
    };

    const response = await FreelancerApi.updatePhoto(request);
    dispatch(addUser(response));
    setDisplayCoverImage(false);
    toast.current.show({
      severity: "success",
      summary: "Operación correcta",
      detail: "La imagen se ha actualizado correctamente",
      life: 3000,
    });
  };

  const removeCoverPhoto = async (base64) => {
    const userData = { ...user };
    userData.cover = null;
    const data = await FreelancerApi.updateFreelancer(userData.id, userData);
    dispatch(addUser(data));
    toast.current.show({
      severity: "success",
      summary: "Actualización correcta",
    });
  };
  // console.log(
  //   !user?.cover
  //     ? getURLImage(user.cover)
  //     : getURLImage("images/treff_waves.png", true)
  // );
  return (
    <>
      <section
        className="hero is-info backgroud-wave-full has-text-right mt-3"
        style={{
          backgroundImage: "url(" + coverUrl + ")",
          paddingBottom: "0px !important",
        }}
      >
        <div className="hero-body has-text-centered pb-0">
          <Avatar
            className="ml-3 mt-2"
            image={
              user?.photo
                ? getURLImage(user?.photo)
                : getURLImage("images/user_undefined.png", true)
            }
            size="xlarge"
            shape="circle"
            style={{ width: "150px", height: "150px" }}
          >
            {photo()}
          </Avatar>
        </div>
        <span
          title="Actualizar photo de portada"
          // className="custom-badge"
          style={{
            position: "absolute",
            right: "0px",
            marginTop: "5px",
            backgroundColor: "rgba(0,0,0,0.0)",
          }}
          onClick={() => onCameraCoverClick()}
        >
          <span
            className="p-badge p-component p-badge-lg"
            style={{
              backgroundColor: "rgba(0,0,0,0.3)",
              paddingTop: "4px",
              cursor: "pointer",
            }}
          >
            <img src={getURLImage("images/camera.svg", true)} alt="camera" />
          </span>

          <input
            type="file"
            id="file"
            ref={inputFileCover}
            style={{ display: "none" }}
            onChange={onChangeFileCover}
          />
        </span>
        {user?.cover && (
          <span
            title="Borrar photo de portada"
            // className="custom-badge"
            style={{
              position: "absolute",
              right: "45px",
              marginTop: "5px",
              backgroundColor: "rgba(0,0,0,0.0)",
            }}
            onClick={() => removeCoverPhoto()}
          >
            <span
              className="p-badge p-component p-badge-lg"
              style={{
                backgroundColor: "rgba(0,0,0,0.3)",
                paddingTop: "5px",
                cursor: "pointer",
              }}
            >
              <img
                src={getURLImage("images/delete.png", true)}
                width="25"
                alt="camera"
              />
            </span>
          </span>
        )}
      </section>
      <CustomSection type="primary">
        <div className="has-text-centered p-4">
          <p className="text-light">{user.name}</p>
          {/* <p className="text-light">{user.country}</p> */}
          <p className="text-16-gray">
            {user?.isFreelancer ? "Freelancer" : "Contratante"}
          </p>
          <Switch
            onChange={() => {
              const userData = { ...user };
              userData.isFreelancer = !userData.isFreelancer;
              dispatch(updateUser(userData));
            }}
            checked={user?.isFreelancer}
          />
          <p className="text-16-gray">
            Activo desde el {setDateString(user?.activeDate)}
          </p>
        </div>
      </CustomSection>
      <CustomSection type="light">
        <section className="hero is-white blue">
          <Menubar
            model={items.filter(
              (i) =>
                i.isFreelancer === userRedux?.isFreelancer ||
                i.isFreelancer === undefined
            )}
          />
          <div className="hero-body has-text-centered pb-0 is-light">
            <Outlet />
          </div>
        </section>
      </CustomSection>
      <Dialog
        header="Edita tu foto de perfil"
        visible={displayProfileImage}
        // style={{ width: "80vw" }}
        onHide={() => setDisplayProfileImage(false)}
        breakpoints={{ "1024px": "75vw", "960px": "75vw", "640px": "100vw" }}
      >
        <ImageEditor
          image={profilePhoto}
          getImge={saveProfilePhoto}
          isAvatar={true}
        />
      </Dialog>
      <Dialog
        header="Edita tu foto de perfil"
        visible={displayCoverImage}
        // style={{ width: "80vw" }}
        onHide={() => setDisplayCoverImage(false)}
        breakpoints={{ "1024px": "75vw", "960px": "75vw", "640px": "100vw" }}
      >
        <ImageEditor
          image={coverPhoto}
          getImge={saveCoverPhoto}
          isCover={true}
        />
      </Dialog>
      <Toast ref={toast} />
    </>
  );
};

export default DashboardFreelancerProfile;
