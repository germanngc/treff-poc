import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import React, { useEffect, useState } from "react";
import { ServiceApi } from "../api";
import CustomSection from "../components/CustomSection";
import { getURLImage } from "../utils/images";
import SectionContent from "../components/SectionContent";
import ReactStars from "react-rating-stars-component";
import { Link, useNavigate, useParams } from "react-router-dom";
import { setDateString } from "../utils/dates";
import Carousel from "react-gallery-carousel";
import "react-gallery-carousel/dist/index.css";
import ServicesByFreelancer from "../components/ServicesByFreelancer";
import { routes } from "../routes";
import { Avatar } from "primereact/avatar";
import { Dialog } from "primereact/dialog";
import LoginModal from "../components/LoginModal";
import { useDispatch, useSelector } from "react-redux";
import { setIdsChat, toggleChat } from "../redux/chatReducer";
import BackButton from "../components/BackButton";

const Service = () => {
  const { id } = useParams();
  const [service, setService] = useState([]);
  const [visibleLogin, setVisibleLogin] = useState(false);
  const userRedux = useSelector((state) => state.user.value);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const getService = async () => {
      await getServicesAsync(id);
    };
    getService();
  }, [id]);

  useEffect(() => {
    const updateView = async () => {
      if (service.freelancer?.id && userRedux.id !== service.freelancer?.id) {
        await ServiceApi.updateView(id, userRedux?.id);
      }
    };
    updateView();
  }, [id, userRedux?.id, service.freelancer?.id]);

  const getServicesAsync = async (id) => {
    const ser = await ServiceApi.getServiceById(id);
    setService(ser);
  };

  const getGallery = (photos) => {
    let images = [];
    photos.forEach((p) => {
      images.push({
        src: getURLImage(p.image),
      });
      console.log(getURLImage(p.image));
    });
    return images;
  };

  const startProject = (packageData) => {
    if (userRedux?.id) {
      const url = routes.NEWPROJECT.replace(":idService", id).replace(
        ":idPackage",
        packageData.id
      );
      navigate(url);
    } else {
      setVisibleLogin(true);
    }
  };

  const onCloseLogin = () => {
    setVisibleLogin(false);
    // clickMenuHandler();
  };

  const contact = () => {
    if (userRedux?.id) {
      dispatch(toggleChat());
      dispatch(
        setIdsChat({
          currentUserId: userRedux.id,
          userId: service.freelancerId,
        })
      );
    } else {
      setVisibleLogin(true);
    }
  };

  const getComments = (comments) => {
    return comments.map((s, index) => (
      <div key={index} className="column has-text-centered text-slide">
        <div
          key={index}
          className="card"
          style={{
            width: "100%",
            height: "auto",
            backgroundRepeat: "no-repeat",
            backgroundSize: "contain",
            cursor: "pointer",
            padding: "10px 0px 20px 0px",
          }}
        >
          <div
            className="card-content"
            style={{
              padding: "10px 0px 0px 0px",
            }}
          >
            <div className="content pl-5 pr-5">
              <div className="has-text-right">
                {setDateString(s.comment.createdDate)}
              </div>
              <footer className="card-footer has-text-left">
                <img
                  className="rounded ml-4 mt-2"
                  src={getURLImage(s.comment?.user?.photo)}
                  alt="freelancer"
                />
                {/* <Avatar
                  className="ml-4 mt-2"
                  image={getURLImage(s.comment?.user?.photo)}
                  size="xlarge"
                  shape="circle"
                /> */}
                <p className="ml-4">
                  <br />
                  <b>{s.comment.title}</b>
                  <br />
                  <p>{s.comment.description}</p>
                </p>
              </footer>
            </div>
          </div>
        </div>
      </div>
    ));
  };

  const showPackages = (packages) => {
    if (packages != null) {
      return (
        <div className="columns">
          {packages.map((p, index) => (
            <div key={index} className="column is-6">
              <div className="card">
                <div className="card-content">
                  <div className="content">
                    <div className="columns is-vcentered">
                      <div className="column is-6">
                        {!p.premium && <div className="mt-4" />}
                        <p className="plan-title">
                          {p.premium ? "Premium" : "Básico"}
                        </p>
                      </div>
                      <div className="column is-6 has-text-right is-vcentered">
                        {p.premium && (
                          <img
                            src={process.env.PUBLIC_URL + "/images/Plan.png"}
                            alt="premuim"
                          />
                        )}
                      </div>
                    </div>

                    {!p.premium && <div className="mt-5" />}

                    <p className="price-dark">${p.cost} MXN</p>
                    <p className="subtitle-2-dark">{p.name}</p>

                    <p>{p.description}</p>

                    <article className="message is-primary p-0">
                      <div
                        className="message-header"
                        style={{ color: "#FFFFFF", width: "100%" }}
                      >
                        <div className="columns is-vcentered is-multiline">
                          <div className="column is-2">
                            <img
                              width={20}
                              src={getURLImage("images/clock.svg", true)}
                              alt="time"
                            />
                          </div>
                          <div className="column is-10 has-text-left is-vcentered">
                            Tiempo de entrega {p.time} día(s)
                          </div>
                          <div className="column is-2">
                            <img
                              width={20}
                              src={getURLImage("images/review.svg", true)}
                              alt="time"
                            />
                          </div>
                          <div className="column is-9 has-text-left is-vcentered">
                            {p.numReviews} Revision(es).
                          </div>
                        </div>
                      </div>
                    </article>
                    {userRedux?.id !== service.freelancerId && (
                      <button
                        className="button is-success"
                        style={{ width: "100%" }}
                        onClick={() => startProject(p)}
                      >
                        Contrata servicio {p.premium ? "Premium" : "Básico"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }
  };

  return (
    <>
      <CustomSection type="white">
      <BackButton back={true} />
        <SectionContent type="light">
          <div className="columns is-multiline">
            <div className="column  is-6-widescreen is-12-tablet">
              <div className="columns">
                <div className="column is-9">
                  <p className="subtitle-dark">{service.name}</p>
                  {userRedux?.id === service.freelancer?.id && (
                    <p>
                      <i
                        className="pi pi-eye mt-3"
                        style={{ fontSize: "1.3rem" }}
                      />
                      <span className="ml-3">
                        {service?.views?.length} visita(s)
                      </span>
                    </p>
                  )}
                </div>

                <div className="column is-3 has-text-centered">
                  <Link
                    to={routes.FREELANCERPROFILE.replace(
                      ":id",
                      service.freelancerId
                    )}
                  >
                    {service.freelancer?.photo && (
                      <Avatar
                        className="ml-4 mt-2"
                        image={getURLImage(service.freelancer?.photo)}
                        size="large"
                        shape="circle"
                      />
                    )}
                    <p>{service.freelancer?.name}</p>
                  </Link>
                </div>
              </div>
              {service.serviceImages && service.serviceImages.length > 0 && (
                <div className="carousel-container short">
                  <Carousel
                    images={getGallery(service.serviceImages)}
                    hasThumbnails={false}
                    hasMediaButton={false}
                    hasSizeButton="bottomRight"
                  />
                </div>
              )}

              {service.freelancer &&
                service.freelancer?.freelancerComments &&
                service.freelancer?.freelancerComments.length > 0 && (
                  <>
                    <p className="subtitle-2-dark mt-6">
                      Lo que la gente resalta del freelancer
                    </p>
                    <br />
                    <div className="carousel-container short">
                      <Carousel
                        isLoop={false}
                        hasIndexBoard={false}
                        hasMediaButton={false}
                        hasMediaButtonAtMax="bottomLeft"
                        hasDotButtons="bottom"
                        hasThumbnails={false}
                        shouldSwipeOnMouse={false} // for selecting text
                        shouldMinimizeOnSwipeDown={false} // for vertical overflow scrolling
                        hasSizeButton={false}
                        style={{ userSelect: "text" }}
                        leftIcon={
                          <img
                            src={process.env.PUBLIC_URL + "/images/Atras.png"}
                            alt="adelante"
                            width={50}
                          />
                        }
                        rightIcon={
                          <img
                            src={
                              process.env.PUBLIC_URL + "/images/Adelante.png"
                            }
                            alt="adelante"
                            width={50}
                          />
                        }
                      >
                        {getComments(service.freelancer?.freelancerComments)}
                      </Carousel>
                    </div>
                  </>
                )}

              <p className="subtitle-2-dark mt-6">Descripcion de servicio</p>
              <br />
              <div
                className="has-text-justified"
                dangerouslySetInnerHTML={{ __html: service.description }}
              />
              <p className="subtitle-2-dark mt-6">¿Por qué yo?</p>
              <br />
              <div
                className="has-text-justified"
                dangerouslySetInnerHTML={{ __html: service.freelancer?.whyMe }}
              />

              <article className="message is-dark mt-6">
                <div className="message-body">
                  <p className="subtitle-2-dark mb-4">Vendedor</p>
                  <div className="columns is-multiline">
                    <div className="column is-3-widescreen is-12-tablet has-text-centered  has-text-centered-mobile">
                      {service.freelancer?.photo && (
                        <Avatar
                          className="mt-2"
                          image={getURLImage(service.freelancer?.photo)}
                          size="large"
                          shape="circle"
                        />
                      )}
                    </div>
                    <div className="column is-10  is-12-tablet is-multiline">
                      <div className="columns is-multiline">
                        <div className="column is-8-widescreen is-12-tablet has-text-left-widescreen has-text-centered-mobile has-text-centered-tablet">
                          <Link
                            to={routes.FREELANCERPROFILE.replace(
                              ":id",
                              service.freelancerId
                            )}
                          >
                            <p>
                              <b>{service.freelancer?.name}</b>
                            </p>
                            <p>{service.freelancer?.title}</p>
                            {service.freelancer?.score && (
                              <div className="has-text-centered-tablet has-text-centered-mobile columns">
                                <div className="column is-full-widescreen is-8-desktop  is-offset-3-desktop is-8-tablet  is-offset-3-tablet is-full-mobile is-offset-2-mobile is-offset-0-widescreen">
                                  <ReactStars
                                    count={5}
                                    edit={false}
                                    // onChange={ratingChanged}
                                    size={24}
                                    activeColor="#ffd700"
                                    value={service.freelancer?.score}
                                    isHalf={true}
                                  />
                                </div>
                              </div>
                            )}
                          </Link>
                        </div>
                        <div className="column is-3-widescreen is-12-tablet">
                          {userRedux?.id !== service.freelancerId && (
                            <button
                              className="button is-link"
                              style={{ width: "100%" }}
                              onClick={() => contact()}
                            >
                              Contáctame
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="subtitle-2-dark mb-4">
                    {service.freelancer?.country}
                  </p>
                  <p>
                    Activo desde el{" "}
                    {setDateString(service.freelancer?.activeDate)}
                  </p>

                  <p className="mt-6">{service.freelancer?.description}</p>
                </div>
              </article>
            </div>
            <div className="column is-6-widescreen is-12-tablet">
              {showPackages(service.packages)}
              {userRedux?.id !== service.freelancerId && (
                <div className="column">
                  <div className="column is-half is-offset-one-quarter has-text-centered">
                    <div className="has-text-centered">
                      <button
                        className="button is-primary width={50}"
                        style={{ width: "100%" }}
                      >
                        Solicitar cotización especial
                      </button>
                    </div>
                    <div className="has-text-centered mt-4">
                      <button
                        className="button is-light"
                        style={{ width: "100%" , border: "1px solid #727272" }}
                      >
                        Contactar vendedor
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </SectionContent>
      </CustomSection>
      <CustomSection type="white">
        <ServicesByFreelancer freelancerId={service.freelancer?.id} />
      </CustomSection>
      <Dialog
        visible={visibleLogin}
        onHide={() => setVisibleLogin(false)}
        breakpoints={{ "1024px": "75vw", "960px": "75vw", "640px": "100vw" }}
        // style={{ width: "50vw" }}
      >
        <LoginModal onClose={() => onCloseLogin()} />
      </Dialog>
    </>
  );
};

export default Service;
