import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ProjectApi } from "../../../api";
import CustomSection from "../../CustomSection";
import SectionContent from "../../SectionContent";

import { Card } from "primereact/card";
import { setDateString } from "../../../utils/dates";
import { Avatar } from "primereact/avatar";
import { getURLImage } from "../../../utils/images";
import { useDispatch, useSelector } from "react-redux";
import ReactStars from "react-rating-stars-component";
import { getStatusValue, statusEnum } from "../../../utils/status";
import { setIdsChat, toggleChat } from "../../../redux/chatReducer";

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [status, setStatus] = useState(null);
  const navigate = useNavigate();
  const userRedux = useSelector((state) => state.user.value);
  const dispatch = useDispatch();
  useEffect(() => {
    const getProject = async () => {
      const data = await ProjectApi.getProjectById(id);
      if (data) {
        if (
          !(
            data.freelancer.id === userRedux.id || data.user.id === userRedux.id
          )
        ) {
          navigate("/");
          return;
        }
      }
      setProject(data);

      setStatus(getStatusValue(project?.status));
    };
    getProject();
  }, [id, navigate, project?.status, userRedux.id]);

  const getPackageCardTheme = (service, packageData, serviceAmount) => {
    const header = (
      <img alt="Card" src={getURLImage(service?.category?.image)} />
    );
    const footer = (
      <div className="has-text-right">
        <div className="has-text-right">
          <p className="has-text-right">
            <b>
              <span className="price-from">A partir de</span>{" "}
              <span className="price-from-value">
                ${packageData && packageData.cost} MXN
              </span>
            </b>
          </p>
          <p className="has-text-justified mt-4 description-total">
            {packageData && packageData.description}
          </p>
        </div>
        {/* <div className="columns mt-6">
          <div className="column is-7 has-text-left total">
            Cargo por sevicio
          </div>
          <div className="column is-5 price has-text-right">
            {Number(serviceAmount).toFixed(2)} MXN
          </div>
        </div> */}
        <div className="columns mt-2">
          <div className="column is-5 has-text-left total">Total</div>
          <div className="column is-7 price has-text-right">
            {Number(packageData?.cost).toFixed(2)} MXN
          </div>
        </div>
        <article className="message is-primary">
          <div className="message-header" style={{ color: "#FFFFFF" }}>
            <div className="columns is-vcentered is-multiline">
              <div className="column is-2">
                <img
                  width={20}
                  src={getURLImage("images/clock.svg", true)}
                  alt="time"
                />
              </div>
              <div className="column is-10 has-text-left is-vcentered">
                Tiempo de entrega {packageData?.time} día(s)
              </div>
              {/* </div>
            <br />
            <div className="columns is-vcentered"> */}
              <div className="column is-2">
                <img
                  width={20}
                  src={getURLImage("images/review.svg", true)}
                  alt="time"
                />
              </div>
              <div className="column is-9 has-text-left is-vcentered">
                {packageData?.numReviews} Revision(es).
              </div>
            </div>
          </div>
        </article>
      </div>
    );
    return (
      <>
        {/* <Link to={routes.SERVICE.replace(":id", service.id)}> */}
        <Card footer={footer} header={header} className="mr-0 mb-4 mt-6">
          <div
            className="has-text-left"
            style={{ minHeight: "150px !important" }}
          >
            <div className="columns is-vcentered is-mobile">
              <div className="column is-4-tablet is-4-mobile is-3-desktop is-3-widescreen">
                {service?.freelancer?.photo && (
                  <Avatar
                    className="ml-3 mt-2"
                    image={getURLImage(service.freelancer?.photo)}
                    size="large"
                    shape="circle"
                  />
                )}
              </div>
              <div className="column is-8-mobile">
                <p className="ml-4">
                  <br />
                  {service?.freelancer.name}
                  <br />
                  <b>{service?.name}</b>
                </p>
              </div>
            </div>
          </div>
          <hr />
        </Card>
        {/* </Link> */}
      </>
    );
  };

  const contact = () => {
    if (userRedux?.id) {
      dispatch(toggleChat());
      dispatch(
        setIdsChat({
          currentUserId: userRedux.id,
          userId: project?.service.freelancerId,
        })
      );
    } else {
      // setVisibleLogin(true);
    }
  };

  return (
    <>
      <CustomSection type="white">
        <SectionContent type="light">
          <div className="columns">
            <div className="column is-5">
              <div className="card-gray">
                <Card title="Status del proyecto">
                  <p className="description-total p-4 p-0">
                    Proyecto {status?.text}
                  </p>
                  <p className="description-total p-4 p-0">
                    Fecha de entrega{" "}
                    {setDateString(project?.calculatedFinishDate)}
                  </p>
                </Card>
              </div>

              <div className="card-gray mt-4">
                <Card title="Cliente">
                  <div className="columns is-multiline mt-4">
                    <div className="column is-3 has-text-centered  has-text-centered-mobile">
                      {project?.user?.photo && (
                        <Avatar
                          //   className="mt-2"
                          image={getURLImage(project?.user?.photo)}
                          size="large"
                          shape="circle"
                        />
                      )}
                    </div>
                    <div className="column is-9 is-multiline">
                      <div className="columns is-multiline">
                        <div className="column is-12 has-text-left-widescreen has-text-centered-mobile has-text-centered-tablet">
                          {/* <Link
                            to={routes.FREELANCERPROFILE.replace(
                              ":id",
                              project?.freelancerId
                            )}
                          > */}
                          <p>
                            <b>{project?.user?.name}</b>
                          </p>
                          {/* <p>{project?.user?.title}</p> */}
                          <p className="subtitle-2-dark mb-4 mt-3">
                            {project?.user?.country}
                          </p>
                          <p>
                            Activo desde el{" "}
                            {setDateString(project?.user?.activeDate)}
                          </p>

                          {/* </Link> */}
                        </div>
                        <div className="column">
                          {userRedux?.id !== project?.userId && (
                            <button
                              className="button is-link"
                              style={{ width: "100%" }}
                              onClick={() => contact()}
                            >
                              Contactar
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* <p className="mt-6">{project?.user?.description}</p> */}
                </Card>
              </div>
              <div className="card-gray mt-4">
                {/* <Card title="Status del proyecto"> */}
                {getPackageCardTheme(
                  project?.service,
                  project?.package,
                  project?.package.cost
                )}
                {/* </Card> */}
              </div>
            </div>
            {/* Columna 2 */}
            <div className="column is-7">
              {status?.value === statusEnum.INPROGRESS && (
                <div className="columns">
                  <div className="column">
                    <button
                      className="button is-link"
                      style={{ width: "100%" }}
                      //   onClick={() => contact()}
                    >
                      Entregar Revisión
                    </button>
                  </div>
                  <div className="column">
                    <button
                      className="button is-success"
                      style={{ width: "100%" }}
                      //   onClick={() => contact()}
                    >
                      Proyecto Terminado
                    </button>
                  </div>
                </div>
              )}
              <div className="card-gray mt-4">
                <Card title="Vendedor" className="pb-4">
                  <div className="columns is-multiline mt-4">
                    <div className="column is-3 has-text-centered  has-text-centered-mobile">
                      {project?.freelancer?.photo && (
                        <Avatar
                          //   className="mt-2"
                          image={getURLImage(project?.freelancer?.photo)}
                          size="large"
                          shape="circle"
                        />
                      )}
                    </div>
                    <div className="column is-9 is-multiline">
                      <div className="columns is-multiline">
                        <div className="column is-12 has-text-left-widescreen has-text-centered-mobile has-text-centered-tablet">
                          {/* <Link
                            to={routes.FREELANCERPROFILE.replace(
                              ":id",
                              project?.freelancerId
                            )}
                          > */}
                          <p>
                            <b>{project?.freelancer?.name}</b>
                          </p>
                          <p>{project?.freelancer?.title}</p>

                          {project?.freelancer?.score && (
                            <div className="has-text-centered-tablet has-text-centered-mobile columns">
                              <div className="column is-full-widescreen is-5-desktop  is-offset-5-desktop is-5-tablet  is-offset-4-tablet is-5-mobile is-offset-3-mobile is-offset-0-widescreen">
                                <ReactStars
                                  count={5}
                                  edit={false}
                                  // onChange={ratingChanged}
                                  size={24}
                                  activeColor="#ffd700"
                                  value={project?.freelancer?.score}
                                  isHalf={true}
                                />
                              </div>
                            </div>
                          )}

                          {/* </Link> */}
                        </div>
                        <div className="column">
                          {userRedux?.id !== project?.freelancerId && (
                            <button
                              className="button is-link"
                              style={{ width: "100%" }}
                              onClick={() => contact()}
                            >
                              Contactar
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="subtitle-2-dark mb-4 mt-3">
                    {project?.freelancer?.country}
                  </p>
                  <p>
                    Activo desde el{" "}
                    {setDateString(project?.freelancer?.activeDate)}
                  </p>
                  <p className="mt-6">{project?.freelancer?.description}</p>
                </Card>
              </div>
              <div className="mt-6">
                <p className="subtitle-dark">
                  Creación de diseños interactivos
                </p>
                <p className="mt-3">{project?.service?.name}</p>
                <p className="mt-5 text-dark">Descripcion de servicio</p>
                <p className="mt-3">{project?.service?.description}</p>
              </div>
            </div>
          </div>
        </SectionContent>
      </CustomSection>
    </>
  );
};

export default ProjectDetail;
