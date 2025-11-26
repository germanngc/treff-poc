import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import React, { useEffect, useState } from "react";
import CategoryApi from "../api/CategoryApi";
import { ServiceApi } from "../api";
import CustomSection from "../components/CustomSection";
import { getURLImage } from "../utils/images";
import SectionContent from "../components/SectionContent";
import { Link, useParams } from "react-router-dom";
import { routes } from "../routes";
import { Avatar } from "primereact/avatar";
import BackButton from "../components/BackButton";
import {
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const Explore = () => {
  const { id } = useParams();
  const [categories, setCategories] = useState([]);
  const [servicesHighLight, setServicesHighLight] = useState([]);
  const [services, setServices] = useState([]);
  const [byFreelancer, setByFreelancer] = useState(false);
  const [categoryIdState, setCategoryIdState] = useState(id || undefined);
  const [inputValue, setInputValue] = useState("");
  const [verified, setVerified] = useState(false);
  const [invoice, setInvoice] = useState(false);
  const [expressDelivery, setExpressDelivery] = useState(false);
  const [filterOption, setFilterOption] = useState(1);

  useEffect(() => {
    const getCategories = async () => {
      const cat = await CategoryApi.getCategories();
      setCategories(cat);
    };

    // const getServicesHighLight = async () => {
    //   await getServicesHighLightAsync(id);
    // };

    // const getServices = async () => {
    //   await getServicesAsync(id);
    // };
    getCategories();
    // filter();
    // getServicesHighLight();
    // getServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setCategoryIdState(id);
  }, [id]);

  const getServicesOnSelect = async (e) => {
    const catId = e.target.value !== "0" ? e.target.value : null;
    // TODO: setear el estado de la categoria seleccionada
    setCategoryIdState(parseInt(catId));
  };

  useEffect(() => {
    const getServices = async () => {
      await filter();
    };
    getServices();
  }, [
    categoryIdState,
    byFreelancer,
    verified,
    invoice,
    expressDelivery,
    filterOption,
  ]);

  const setExploreOnSelect = async (e) => {
    const exploreOption = e.target.value === "true";

    setByFreelancer(exploreOption);
    // await filter();
  };

  const freelancerCard = (service, index) => {
    return (
      <div
        key={index}
        className={"column is-3-widescreen is-6-desktop is-6 has-text-centered"}
      >
        <Link
          to={
            byFreelancer
              ? routes.FREELANCERPROFILE.replace(":id", service.freelancerId)
              : routes.SERVICE.replace(":id", service.id)
          }
        >
          <div
            className="card"
            style={{
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
              <div className="content">
                <img
                  src={getURLImage(service.category?.image)}
                  alt="servicio"
                />
                <hr className="m-2" />
                <div className="has-text-left">
                  <div className="columns is-vcentered is-mobile">
                    <div className="column ml-4 is-4-tablet is-4-mobile is-3-desktop is-3-widescreen has-text-centered">
                      <Avatar
                        image={getURLImage(service.freelancer?.photo)}
                        size="large"
                        shape="circle"
                      />
                    </div>
                    <div className="column is-8-mobile">
                      {byFreelancer ? (
                        <p className="ml-2">
                          <b>{service.freelancer.name}</b>
                          <br />
                          {/* <br />
                          {service.name} */}
                        </p>
                      ) : (
                        <p className="ml-1 pt-0 pr-4 pl-4">
                          <b>{service.name}</b>
                          <br />
                          de {service.freelancer.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <hr className="m-1" />
            <div className="has-text-right mt-3 p-1 mb-3">
              <div className="has-text-right">
                <p className="has-text-right">
                  <b>A partir de ${service.packages[0].cost} MXN</b>
                </p>
              </div>
            </div>
          </div>
        </Link>
      </div>
    );
  };

  const filter = async () => {
    const ser = await ServiceApi.filterServices(
      inputValue,
      categoryIdState || 0,
      byFreelancer,
      expressDelivery === "true"
        ? true
        : expressDelivery === "false"
        ? false
        : null,
      filterOption,
      verified === "true" ? true : verified === "false" ? false : null,
      invoice === "true" ? true : invoice === "false" ? false : null,
      !byFreelancer
    );
    const servicesHighLight = ser.filter((s) => s.highlight);
    setServicesHighLight(servicesHighLight);
    const services = ser.filter((s) => !s.highlight);
    setServices(services);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    filter();
  };

  return (
    <>
      <CustomSection type="white">
        <BackButton />
        <section
          className="hero is-primary img-header"
          style={{
            backgroundImage:
              "url('" +
              "/images/pexels-alexander-dummer-134469 2.png')",
            height: "150px",
          }}
        >
          <div className="hero-body pb-1 pt-3">
            <div className="columns is-multiline">
              <div className="column is-7-desktop has-text-left has-text-left-mobile  has-text-left-tablet is-12-tablet">
                <h1
                  className="has-text-white title ml-4 size-20"
                  style={{ fontWeight: 800 }}
                >
                  Explora a nuestros servicios
                </h1>
                <div>
                  <img
                    className="pt-0 img-logo-287"
                    src={
                      "/images/Logo Treff blanco  2 (2).png"
                    }
                    alt="treff"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </CustomSection>

      <CustomSection type="white">
        <SectionContent type="light" className="pt-1 pl-2 pb-3">
          {byFreelancer ? (
            <p className="subtitle-dark">Explorar freelancer </p>
          ) : (
            <p className="subtitle-dark">
              Servicios{" "}
              {categoryIdState && categories && (
                <span>
                  {" "}
                  /{" "}
                  {
                    categories.filter(
                      (c) => c.id === parseInt(categoryIdState)
                    )[0]?.name
                  }
                </span>
              )}{" "}
            </p>
          )}
          <div className="columns mt-3 is-multiline size-16">
            <div className="column is-12 is-mobile">
              <form onSubmit={handleSubmit}>
                <TextField
                  className="w-1/2"
                  // label="Buscador"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Busca un servicio"
                  style={{ width: "100%" }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </form>
            </div>
          </div>
          <div className="columns mt-3 is-multiline size-16">
            <div className="column is-6 is-12-mobile is-2-desktop">
              <div className="select">
                <select onChange={setExploreOnSelect}>
                  <option value={0}>Explora por</option>
                  {/* {categories.map((c) => ( */}
                  <option value={false}>Explora servicios</option>
                  <option value={true}>Explora freelancers</option>
                  {/* ))} */}
                </select>
              </div>
            </div>
            <div className="column is-6 is-12-mobile is-2-desktop">
              <div className="select">
                <select value={categoryIdState} onChange={getServicesOnSelect}>
                  <option value={0}>Categorías</option>
                  {categories.map((c, i) => (
                    <option key={i} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="column is-6 is-12-mobile is-2-desktop">
              <div className="select">
                <select
                  value={verified}
                  onChange={(e) => {
                    setVerified(e.target.value);
                  }}
                >
                  <option>Verificado</option>
                  <option value={true}>Si</option>
                  <option value={false}>No</option>
                </select>
              </div>
            </div>
            <div className="column is-6 is-12-mobile is-2-desktop">
              <div className="select">
                <select
                  value={invoice}
                  onChange={(e) => {
                    setInvoice(e.target.value);
                  }}
                >
                  <option>Factura</option>
                  <option value={true}>Si</option>
                  <option value={false}>No</option>
                </select>
              </div>
            </div>
            <div className="column is-6 is-12-mobile is-3-desktop">
              <div className="select">
                <select
                  value={expressDelivery}
                  onChange={(e) => {
                    setExpressDelivery(e.target.value);
                  }}
                >
                  <option value={null}>Entrega Express</option>
                  <option value={true}>Si</option>
                  <option value={false}>No</option>
                </select>
              </div>
            </div>
          </div>
        </SectionContent>
      </CustomSection>
      <CustomSection type="white">
        <div className="column is-4 is-offset-8 has-text-right">
          <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="demo-simple-select-standard-label">
              Filtro
            </InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              value={filterOption}
              onChange={(e) => setFilterOption(e.target.value)}
              label="Filtro"
            >
              <MenuItem value={1}>Mayor precio</MenuItem>
              <MenuItem value={2}>Menor precio</MenuItem>
              <MenuItem value={3}>Mayor Ranking</MenuItem>
              <MenuItem value={4}>Más reciente</MenuItem>
              <MenuItem value={5}>Más antiguo</MenuItem>
            </Select>
          </FormControl>
        </div>
      </CustomSection>

      <CustomSection type="white">
        <SectionContent type="white" className="pt-4 pl-2 pb-3">
          <p className="subtitle-dark">Destacados</p>
        </SectionContent>
        {servicesHighLight.length > 0 && (
          <SectionContent
            type="light"
            className="pt-3 pl-3 pb-3"
            style={{ border: "0.5px solid #C2C2C2" }}
          >
            <div className="columns mt-1 is-multiline">
              {servicesHighLight.map((s, index) => freelancerCard(s, index))}
            </div>
          </SectionContent>
        )}
      </CustomSection>

      <CustomSection type="white">
        <SectionContent type="white" className="pt-4 pl-2 pb-3">
          <div className="columns mt-0 is-multiline">
            {services.length === 0 && (
              <div className="column is-12 has-text-centered">
                <p className="subtitle-dark my-6">
                  No hay servicios en este momento con los filtros aplicados.
                </p>
              </div>
            )}
            {services.map((s, index) => freelancerCard(s, index))}
          </div>
        </SectionContent>
      </CustomSection>
    </>
  );
};

export default Explore;
