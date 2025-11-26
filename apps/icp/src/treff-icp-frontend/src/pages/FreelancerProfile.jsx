import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { FreelancerApi } from "../api";
import CustomSection from "../components/CustomSection";
import SectionContent from "../components/SectionContent";
import { getURLImage } from "../utils/images";
import ReactStars from "react-rating-stars-component";
import { setDateString } from "../utils/dates";
import ServicesByFreelancer from "../components/ServicesByFreelancer";
import "react-gallery-carousel/dist/index.css";
import { Avatar } from "primereact/avatar";

const FreelancerProfile = () => {
  const { id } = useParams();
  const [freelancer, setFreelancer] = useState([]);
  const [skills, setSkills] = useState([]);

  const getComments = (comments) => {
    if (!comments) {
      return;
    }
    return comments.map((s, index) => (
      <div key={index} className="column has-text-centered text-slide">
        <div
          key={index}
          className="card pb-3"
          style={{
            width: "100%",
            backgroundRepeat: "no-repeat",
            backgroundSize: "contain",
            cursor: "pointer",
            padding: "10px 0px 0px 0px",
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

  useEffect(() => {
    const getFreelancer = async () => {
      const servs = await FreelancerApi.getFreelancerById(id);
      setFreelancer(servs);
      const dataSkills = servs.skills.split("||");
      setSkills(dataSkills);
    };
    if (id) {
      getFreelancer();
    }
  }, [id]);
  return (
    <>
      <CustomSection type="white">
        <SectionContent type="light">
          <div className="columns is-multiline">
            <div className="column  is-6-widescreen is-12-tablet">
              <p className="subtitle-dark">Perfil</p>
              <div className="columns mt-4 is-vcentered">
                <div className="column is-3 is-3-widescreen">
                  {freelancer?.photo && (
                    <Avatar
                      className="ml-4 mt-2"
                      image={getURLImage(freelancer?.photo)}
                      style={{ width: "100px", height: "100px" }}
                      size="xlarge"
                      shape="circle"
                    />
                  )}
                </div>
                <div className="column is-3">
                  <p>
                    <b>{freelancer?.name}</b>
                    <p>{freelancer?.title}</p>
                    {freelancer?.score > 0 && (
                      <div className="has-text-centered-tablet has-text-centered-mobile columns">
                        <div className="column">
                          <ReactStars
                            count={5}
                            edit={false}
                            // onChange={ratingChanged}
                            size={24}
                            activeColor="#ffd700"
                            value={freelancer?.score}
                            isHalf={true}
                          />
                        </div>
                      </div>
                    )}
                  </p>
                </div>
                <div className="column  is-6-widescreen">
                  <button className="button is-link" style={{ width: "100%" }}>
                    Solicita una cotización especial
                  </button>
                </div>
              </div>
              <p className="text-dark mb-4 mt-6">{freelancer?.country}</p>
              <p>Activo desde el {setDateString(freelancer?.activeDate)}</p>
              <p className="text-dark mt-6">Descripción</p>
              {/* <p className="has-text-justified">
                {freelancer?.description}
              </p> */}
              <br />
              <div
                className="has-text-justified"
                dangerouslySetInnerHTML={{ __html: freelancer?.description }}
              />

              <p className="text-dark mt-6">¿Por qué yo?</p>
              <br />
              <div
                className="has-text-justified"
                dangerouslySetInnerHTML={{ __html: freelancer?.whyMe }}
              />

              <p className="text-dark mt-6">Habilidades</p>
              <br />

              <div className="columns tags are-medium">
                {skills.map((s, i) => (
                  <div
                    key={i}
                    className="column is-full is-full-mobile tag is-dark is-rounded"
                  >
                    {s}
                  </div>
                ))}
              </div>
            </div>
            {/* Columna derecha */}
            <div className="column is-6-widescreen is-12-tablet">
              <p className="text-dark">Reseñas</p>
              <br />
              <div className="carousel-container short">
                {getComments(freelancer?.freelancerComments)}
                <div className="columns mt-6">
                  {freelancer?.educations?.length > 0 && (
                    <div className="column is-6">
                      <p className="text-dark">Educación</p>
                      <ul className="mt-4">
                        {freelancer?.educations?.map((e, i) => (
                          <li key={i} className="mb-4">
                            {e.title} {e.titleName} - {e.university}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {freelancer?.languages?.length > 0 && (
                    <div className="column is-6">
                      <p className="text-dark">Idiomas</p>
                      <ul className="mt-4">
                        {freelancer?.languages?.map((e, i) => (
                          <li key={i} className="mb-4">
                            {e.name} - {e.level}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {freelancer?.certifications?.length > 0 && (
                  <>
                    <p className="text-dark mt-6">Certificados</p>
                    <ul className="mt-4">
                      {freelancer?.certifications?.map((e, i) => (
                        <li key={i} className="mb-4">
                          {e.name}
                          <br />
                          {e.institute}, Graduado en {e.year}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>
          </div>
        </SectionContent>
      </CustomSection>
      <CustomSection type="white">
        <ServicesByFreelancer freelancerId={freelancer?.id} />
      </CustomSection>
    </>
  );
};

export default FreelancerProfile;
