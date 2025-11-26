import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import React, { useEffect, useRef, useState } from "react";
import { Parallax, Background } from "react-parallax";
import ScrollingMenu from "../components/ScrollingMenu";
import { Link, useNavigate } from "react-router-dom";
import { routes } from "../routes";
import { Carousel } from "primereact/carousel";
import { useSelector } from "react-redux";
import { Dialog } from "primereact/dialog";
import LoginModal from "../components/LoginModal";
import { CategoryApi, ServiceApi } from "../api";
import { getURLImage } from "../utils/images";
import { ReactImageAccordion } from "react-image-accordion";

const responsiveOptions = [
  {
    breakpoint: "1024px",
    numVisible: 3,
    numScroll: 1,
  },
  {
    breakpoint: "600px",
    numVisible: 2,
    numScroll: 1,
  },
  {
    breakpoint: "480px",
    numVisible: 1,
    numScroll: 1,
  },
];

const accordionData = [
  {
    id: 1,
    title: "Cliente",
    image: "/images/pexels-fauxels-3184611 1.png",
    alt: "first panel image",
    content: (
      <p className="has-text-justified mt-1 size-18 has-text-white">
        Somos una plataforma única donde tendrás acceso a una variada oferta de
        servicios brindados por freelancers comprometidos y altamente
        capacitados para satisfacer tus necesidades. <br />
        <br />
        Al elegir TREFF, evitarás la complejidad de contratar grandes empresas.
        En cambio, te beneficiarás de precios competitivos, un trato
        personalizado y la seguridad de que cada proyecto será gestionado con
        profesionalismo. Actuamos como mediadores entre tus requerimientos y la
        entrega de trabajos de calidad, garantizando que tu experiencia sea
        eficiente, satisfactoria y libre de complicaciones.
        <br />
        <br />
        Bienvenido a TREFF, donde la contratación se vuelve simple, personal y
        centrada en tus objetivos. Tu próximo proyecto merece la atención de
        freelancers comprometidos, y nosotros estamos aquí para hacerlo posible.
      </p>
    ),
    // svg: "aa (1).svg",
  },
  {
    id: 2,
    title: "Freelancer",
    image: "/images/pexels-pavel-danilyuk-6764185 1.png",
    alt: "second panel image",
    content: (
      <div className="has-text-white">
        <p className="has-text-justified mt-1 size-18 has-text-white">
          En TREFF, te proporcionamos una herramienta confiable diseñada para
          que ofrezcas tus servicios como experto independiente de manera
          amigable, ágil y segura.
        </p>
        <p className="has-text-justified mt-3 size-18 has-text-white">
          {" "}
          Nuestro compromiso es brindarte un respaldo constante, asegurando tus
          pagos por los trabajos realizados de acuerdo con tus tiempos,
          capacidades y tarifas . Nosotros reconocemos y valoramos la calidad y
          puntualidad de los servicios que ofreces. Esto significa que tu
          crecimiento en ventas y exposición será una consecuencia directa de la
          apreciación de tu trabajo por parte del cliente y tus propios méritos.
        </p>
        <p className="has-text-justified mt-3 size-18 has-text-white">
          Únete a TREFF, donde tu talento no solo es reconocido, sino también
          recompensado. Aquí, tu camino hacia el éxito como freelancer comienza
          con el respaldo y la plataforma adecuada para destacar en el mercado.
        </p>
      </div>
    ),
    // svg: <p>Hola</p>,
  },
];

const freelancers = [
  {
    name: "Karen Buitrago",
    service: "Marketing Digital",
    image: "/images/pexels-kebs-visuals-3992656 1.png",
    backgroundImage: "/images/pexels-dominika-roseclay-905163 1.png",
  },
  {
    name: "Andres Castro",
    service: "Fotografía",
    image: "/images/pexels-kaique-rocha-598917 1.png",
    backgroundImage: "/images/pexels-alexander-dummer-134469 1.png",
  },
  {
    name: "Karen Buitrago",
    service: "Marketing Digital",
    image: "/images/pexels-pixabay-38289 1.png",
    backgroundImage: "/images/pexels-li-sun-2294403 1.png",
  },
  {
    name: "Karen Buitrago",
    service: "Marketing Digital",
    image: "/images/pexels-kebs-visuals-3992656 1.png",
    backgroundImage: "/images/pexels-dominika-roseclay-905163 1.png",
  },
  {
    name: "Karen Buitrago",
    service: "Marketing Digital",
    image: "/images/pexels-kebs-visuals-3992656 1.png",
    backgroundImage: "/images/pexels-dominika-roseclay-905163 1.png",
  },
];

const freelancersRanking = [
  {
    id: 14,
    image: "url('" + "/images/pexels-pixabay-38289 2.png')",
    name: "Andrea Mendes",
  },
  {
    id: 2,
    image:
      "url('" +
      "/images/pexels-kebs-visuals-3992656 2.png')",
    name: "Karen Buitrago",
  },
  {
    id: 15,
    image:
      "url('" +
      "/images/pexels-omar-lópez-1182825 1.png')",
    name: "Carlos Fajardo ",
  },
  {
    id: 16,
    image:
      "url('" +
      "/images/pexels-pixabay-415829 1.png')",
    name: "Maria Jose Diaz",
  },
  {
    id: 17,
    image:
      "url('" +
      "/images/pexels-vinicius-wiesehofer-1130626 1.png')",
    name: "Tatiana Torres",
  },
];

const getServiceCards = (services, navigate) => {
  return services.map((s, index) => (
    <div
      key={index}
      className="column has-text-centered"
      onClick={() => navigate(routes.EXPLORE + s.id)}
    >
      <div
        className="service-card"
        style={{
          backgroundImage: "url('" + getURLImage(s.image) + "')",

          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          cursor: "pointer",
        }}
      ></div>
      <div
        className="button-service has-text-centered"
        style={{ cursor: "pointer" }}
      >
        {s.name}
      </div>
    </div>
  ));
};

const getFreelancersRankingCards = () => {
  return freelancersRanking.map((s, index) => (
    <Link to={routes.FREELANCERPROFILE.replace(":id", s.id)}>
      <div key={index} className="column has-text-centered">
        <div
          className="freelancer-card"
          style={{
            backgroundImage: s.image,

            backgroundRepeat: "no-repeat",
            backgroundSize: "contain",
            cursor: "pointer",
          }}
        ></div>
        <div
          className="button-ranking has-text-centered size-18"
          style={{ cursor: "pointer" }}
        >
          {s.name}
        </div>
      </div>
    </Link>
  ));
};

const getFreelancersCardsTheme = (s) => {
  return (
    <Link to={routes.SERVICE.replace(":id", s.id)}>
      <div
        className="card ml-3 card-freelancer"
        style={{
          // width: "400px",
          // height: "280px",

          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
          cursor: "pointer",
          padding: "10px 0px 0px 0px",
        }}
      >
        <div
          className="card-content"
          style={{
            padding: "0px 0px 0px 0px",
          }}
        >
          <div className="content">
            <img
              src={getURLImage(s.category?.image)}
              style={{ width: "100%" }}
              alt="servicio"
            />
          </div>
        </div>
        <footer
          className="card-footer has-text-left pb-3"
          style={{
            // width: "400px",
            height: "auto",
          }}
        >
          <img
            className="rounded ml-4 mt-2"
            src={
              s.freelancer?.photo
                ? getURLImage(s.freelancer?.photo)
                : getURLImage("images/user_undefined.png", true)
            }
            alt="freelancer"
          />
          <p className="ml-4">
            <br />
            <b>{s.name}</b>
            <br />
            de {s.freelancer.name}
          </p>
        </footer>
      </div>
    </Link>
  );
};

const Home = () => {
  const userRedux = useSelector((state) => state.user.value);
  const userData = useState(userRedux);
  const [visibleLogin, setVisibleLogin] = useState(false);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const iframeRef = useRef(null);
  const [services, setServices] = useState([]);
  const onCloseLogin = () => {
    setVisibleLogin(false);
  };

  useEffect(() => {
    getHighlightServices();
  }, []);

  useEffect(() => {
    const getCategories = async () => {
      const cat = await CategoryApi.getCategories();
      setCategories(cat);
    };
    getCategories();
  }, []);

  // useEffect(() => {
  //   const observer = new IntersectionObserver(
  //     (entries) => {
  //       if (entries[0].isIntersecting) {
  //         if (iframeRef && iframeRef.current && iframeRef.current.src) {
  //           if (iframeRef.current.src.indexOf("&autoplay=1") === -1)
  //             iframeRef.current.src += "&autoplay=1";
  //         }
  //       }
  //     },
  //     { threshold: 0.5 } // Se activa cuando el 50% del iframe está visible
  //   );

  //   if (iframeRef.current) {
  //     observer.observe(iframeRef.current);
  //   }

  //   return () => {
  //     if (iframeRef.current) {
  //       observer.unobserve(iframeRef.current);
  //     }
  //   };
  // }, []);

  const getHighlightServices = async (byFreelancer = false) => {
    const response = await ServiceApi.getHighlightServices(10, byFreelancer);
    setServices(response);
  };

  return (
    <>
      <Parallax
        blur={0}
        bgImageAlt="Treff"
        bgImage={"/images/pexels-adil-2726478 1.png"}
        strength={500}
      >
        <Background className="custom-bg">
          <div
            className="img-parallax"
            style={{
              backgroundImage: "url('" + "/images/pexels-adil-2726478 1.png')",
              backgroundColor: "rgba(0, 0, 0, 0.4)",
            }}
          />
        </Background>
        <section
          className="hero pb-0"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
        >
          <div className="hero-body">
            <div className="columns">
              <div className="column is-half is-offset-one-quarter mt-2 has-text-centered-mobile has-text-centered-tablet">
                <img
                  src={"/images/Treff_06_color_gradient 1.svg"}
                  alt="logo"
                  style={{ width: "5.5rem" }}
                />
              </div>
            </div>

            <div className="columns">
              <div className="column is-three-fifths is-offset-1 mt-2 has-text-left is-full-mobile">
                <div className="columns">
                  <div className="column is-half is-four-fifths mt-3 has-text-left is-full-mobile">
                    <h1 className="has-text-white title has-text-centered-mobile">
                      Contrata un servicio
                    </h1>
                    <h2 className="subtitle mt-3 has-text-justified-mobile">
                      Somos una herramienta confiable desarrollada para que
                      ofrezcas tus servicios como experto independiente de una
                      forma amigable, ágil y segura.
                    </h2>
                    <div className="has-text-centered-mobile">
                      <Link to={routes.EXPLORE}>
                        <button className="button is-primary button-secondary mt-3 mb-0">
                          Contratar
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Parallax>

      <section className="hero is-white">
        <div className="hero-body pt-3 pb-0">
          <div className="columns">
            <div className="column is-10 is-offset-1 has-text-left">
              <p className="subtitle-dark">Servicios a explorar</p>
              <p
                className="p-blue mb-2 has-text-right mr-5"
                style={{ cursor: "pointer" }}
              >
                <Link
                  to={routes.EXPLORECATEGORY}
                  className="p-blue mb-2 has-text-right mr-5"
                >
                  <b>Ver todas las categorías</b>
                </Link>
              </p>

              <ScrollingMenu items={getServiceCards(categories, navigate)} />
              <div className="columns is-mobile mt-3 is-multiline "></div>
            </div>
          </div>
        </div>
        <br />
      </section>

      <section
        className="hero is-primary"
        style={{
          backgroundImage: "url('" + "/images/Treff_textura02 (1) 1.png')",
          height: "auto",
          padding: "0px 0px 0px 0px",
        }}
      >
        <div className="hero-body pt-5 pb-5">
          <div className="columns is-multiline">
            <div className="column is-7-desktop is-offset-1-desktop has-text-left-desktop has-text-centered-mobile  has-text-centered-tablet is-12-tablet">
              <h1 className="has-text-white title size-28 mt-3">
                Publica un servicio
              </h1>
            </div>
            <div className="column is-3-desktop has-text-left is-full-tablet is-12-tablet has-text-centered-mobile has-text-centered-tablet">
              <Link
                to={
                  userRedux?.id
                    ? routes.DASHBOARD_FREELANCER +
                      "/" +
                      routes.DASHBOARD_SERVICES +
                      "/" +
                      routes.DASHBOARD_SERVICESACTIVE
                    : ""
                }
                onClick={() => {
                  if (!userRedux?.id) {
                    setVisibleLogin(true);
                  }
                }}
              >
                <button
                  className="button is-link size-25"
                  style={{ width: "180px" }}
                >
                  Publicar
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="hero is-light">
        <div className="hero-body pb-0">
          {/* <ReactImageAccordion
            accordionData={accordionData}
            AccordionWidth={"1000px"}
            AccordionHeight={"500px"}
            // ContentSize=[ContentSize]
            // onClick={}
            ShowButton={true / false}
          /> */}
          <div className="columns">
            <div className="column is-10 is-offset-1 has-text-left">
              <div className="has-text-centered">
                <p className="subtitle-dark">
                  A quien estamos dirgidos y por que hacemos la diferencia
                </p>
              </div>
              {/* <div className="columns mt-1 is-multiline ">
                <div className="column is-2">
                  <img
                    src={
                      process.env.PUBLIC_URL +
                      "/images/pexels-fauxels-3184611 1.png"
                    }
                    alt="cliente"
                  />
                </div>
                <div className="column is-8">
                  <div>
                    <p className="subtitle-dark">Cliente</p>
                    <p className="has-text-justified mt-1 size-18">
                      Somos una plataforma única donde tendrás acceso a una
                      variada oferta de servicios brindados por freelancers
                      comprometidos y altamente capacitados para satisfacer tus
                      necesidades. <br />
                      <br />
                      Al elegir TREFF, evitarás la complejidad de contratar
                      grandes empresas. En cambio, te beneficiarás de precios
                      competitivos, un trato personalizado y la seguridad de que
                      cada proyecto será gestionado con profesionalismo.
                      Actuamos como mediadores entre tus requerimientos y la
                      entrega de trabajos de calidad, garantizando que tu
                      experiencia sea eficiente, satisfactoria y libre de
                      complicaciones.
                      <br />
                      <br />
                      Bienvenido a TREFF, donde la contratación se vuelve
                      simple, personal y centrada en tus objetivos. Tu próximo
                      proyecto merece la atención de freelancers comprometidos,
                      y nosotros estamos aquí para hacerlo posible.
                    </p>
                  </div>
                  <div className="mt-3 pt-1">
                    <p className="subtitle-dark has-text-right ">Freelancer</p>
                    <p className="has-text-justified mt-1 size-18">
                      En TREFF, te proporcionamos una herramienta confiable
                      diseñada para que ofrezcas tus servicios como experto
                      independiente de manera amigable, ágil y segura.
                    </p>
                    <p className="has-text-justified mt-3 size-18">
                      {" "}
                      Nuestro compromiso es brindarte un respaldo constante,
                      asegurando tus pagos por los trabajos realizados de
                      acuerdo con tus tiempos, capacidades y tarifas . Nosotros
                      reconocemos y valoramos la calidad y puntualidad de los
                      servicios que ofreces. Esto significa que tu crecimiento
                      en ventas y exposición será una consecuencia directa de la
                      apreciación de tu trabajo por parte del cliente y tus
                      propios méritos.
                    </p>
                    <p className="has-text-justified mt-3 size-18">
                      Únete a TREFF, donde tu talento no solo es reconocido,
                      sino también recompensado. Aquí, tu camino hacia el éxito
                      como freelancer comienza con el respaldo y la plataforma
                      adecuada para destacar en el mercado.
                    </p>
                  </div>
                </div>
                <div className="column is-2 pt-6">
                  <img
                    src={
                      process.env.PUBLIC_URL +
                      "/images/pexels-pavel-danilyuk-6764185 1.png"
                    }
                    alt="freelancer"
                  />
                </div>
              </div> */}
              <ReactImageAccordion
                accordionData={accordionData}
                // AccordionWidth={AccordionWidth}
                // AccordionHeight={AccordionHeight}
                ContentSize={[100, 200]}
                // onClick={}
                ShowButton={false}
              />
            </div>
          </div>
        </div>
        <br />
      </section>

      <section className="hero is-primary">
        <div className="hero-body pb-0 pt-3">
          <div className="columns">
            <div className="column is-10 is-offset-1 has-text-left">
              <p className="subtitle-light mb-1">Ranking</p>
              <p className="text-light mb-3 size-20">
                Nuestros mejores freenlancer{" "}
              </p>
              <ScrollingMenu items={getFreelancersRankingCards()} />
            </div>
          </div>
        </div>
        <br />
      </section>

      <section className="hero is-black pb-0">
        <div className="hero-body pt-5 pb-0">
          <div className="columns">
            <div className="column is-10 is-offset-1 has-text-left">
              <div className="columns is-vcentered">
                <div className="column is-3 mt-1">
                  <p className="subtitle-light">Ven y conoce mas de</p>
                </div>
                <div className="column is-4 is-vcentered">
                  <img
                    className="pt-1"
                    src={"/images/Logo Treff blanco  2.png"}
                    alt="treff"
                  />
                </div>
              </div>
              <p className="text-light mt-0 mb-0">
                Miles de personas hacen parte de esta comunidad{" "}
              </p>
              <div style={{ textAlign: "center" }}>
                <div
                  className="video-container"
                  // style={{ textAlign: "center" }}
                >
                  {/* <img
                  src={process.env.PUBLIC_URL + "/images/Video.png"}
                  alt="video"
                  className="video-presentation"
                /> */}
                  {/* <p style={{ textAlign: "center" }}> */}
                  {/* <iframe
                    ref={iframeRef}
                    width="560"
                    height="315"
                    src="https://www.youtube.com/embed/bPhMhD8kemo?si=HQ4Y3CNaPdba2BIz"
                    title="YouTube video player"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowfullscreen
                  ></iframe> */}
                  {/* </p> */}
                </div>
              </div>
            </div>
          </div>
        </div>
        <br />
      </section>

      <section className="hero is-white">
        <div className="hero-body pb-0 pt-4">
          <div className="columns">
            <div className="column is-10 is-offset-1 has-text-left">
              <p className="subtitle-dark mb-3">Explorar Servicios</p>

              {/* <ScrollingMenu items={getFreelancersCards()} /> */}
              {/* <div className="card">
                <Carousel
                  value={services}
                  numVisible={3}
                  numScroll={1}
                  showIndicators={false}
                  responsiveOptions={responsiveOptions}
                  itemTemplate={getFreelancersCardsTheme}
                  onTouchMove={() => {}}
                />
              </div> */}
            </div>
          </div>
        </div>
        <br />
      </section>

      <section className="hero is-light">
        <div className="hero-body p-0 pt-5">
          <div className="columns">
            <div className="column is-10 is-offset-1 has-text-centered">
              <p className="subtitle-dark mb-4">¿Necesitas ayuda ?</p>
              <p className="text-light mb-0">
                Conoce aqui los centros de ayuda que tenemos disponibles para ti
              </p>
              <Link to={routes.HELP_CENTER}>
                <button
                  className="button is-link size-18 mt-3"
                  style={{ width: "180px" }}
                >
                  Solicitar Ayuda
                </button>
              </Link>
            </div>
          </div>
        </div>
        <br />
      </section>

      <section
        className="hero is-primary hero-opacity"
        style={{
          backgroundImage:
            "url('" + "/images/pexels-tima-miroshnichenko-5453824 1.png')",
          backgroundPosition: "center",
        }}
      >
        <div className="hero-body is-black p-0 pt-3 pb-3">
          <div className="columns is-multiline">
            <div className="column has-text-centered">
              <h1 className="has-text-white title">
                <img
                  className="img-footer"
                  src={"/images/Logo Treff blanco  2 (1).png"}
                  alt="treff"
                />
              </h1>
            </div>
          </div>
        </div>
      </section>
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

export default Home;
