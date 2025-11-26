import { Avatar } from "primereact/avatar";
import { useState } from "react";
import { useEffect } from "react";
import { FreelancerApi } from "../api";
import { getURLImage } from "../utils/images";
import { Carousel } from "primereact/carousel";
import { Card } from "primereact/card";
import { Link } from "react-router-dom";
import { routes } from "../routes";

const responsiveOptions = [
  {
    breakpoint: "10216px",
    numVisible: 5,
    numScroll: 1,
  },
  {
    breakpoint: "1690x",
    numVisible: 5,
    numScroll: 1,
  },
  {
    breakpoint: "1216px",
    numVisible: 4,
    numScroll: 1,
  },
  {
    breakpoint: "1215px",
    numVisible: 3,
    numScroll: 1,
  },
  {
    breakpoint: "700px",
    numVisible: 2,
    numScroll: 1,
  },
  {
    breakpoint: "440px",
    numVisible: 1,
    numScroll: 1,
  },
];
const ServicesByFreelancer = (params) => {
  const freelancerId = params.freelancerId;
  const [services, setServices] = useState([]);

  useEffect(() => {
    const getService = async () => {
      const servs = await FreelancerApi.getServicesByFreelancerId(freelancerId);
      setServices(servs);
    };
    if (freelancerId) {
      getService();
    }
  }, [freelancerId]);

  const getFreelancersCardsTheme = (service) => {
    const header = (
      <img alt="Card" src={getURLImage(service.category?.image)} />
    );
    const footer = (
      <div className="has-text-right">
        <div className="has-text-right">
          <p className="has-text-right">
            <b>A partir de ${service.packages[0].cost} MXN</b>
          </p>
        </div>
      </div>
    );
    return (
      <>
        <Link to={routes.SERVICE.replace(":id", service.id)}>
          <Card footer={footer} header={header} className="mr-4 mb-4">
            <div
              className="has-text-left"
              style={{ minHeight: "150px !important" }}
            >
              <div className="columns is-vcentered is-mobile">
                <div className="column is-4-tablet is-4-mobile is-3-desktop is-3-widescreen">
                  {service.freelancer?.photo && (
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
                    {service.freelancer.name}
                    <br />
                    <b>{service.name}</b>
                  </p>
                </div>
              </div>
            </div>
            <hr />
          </Card>
        </Link>
      </>
    );
  };

  return (
    <>
      {services.length > 1 && (
        <>
          <p className="subtitle-2-dark mt-6">
            Más servicios de {services[0]?.freelancer?.name}
          </p>
          <br />
          <Carousel
            value={services}
            // numVisible={3}
            numScroll={1}
            showIndicators={false}
            responsiveOptions={responsiveOptions}
            itemTemplate={getFreelancersCardsTheme}
            autoplayInterval={3000}
            circular
          />
        </>
      )}
    </>
  );
};

export default ServicesByFreelancer;
