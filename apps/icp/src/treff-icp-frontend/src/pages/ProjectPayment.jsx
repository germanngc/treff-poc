import { Avatar } from "primereact/avatar";
import { Card } from "primereact/card";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { NotificationApi, ProjectApi, ServiceApi } from "../api";
import CustomSection from "../components/CustomSection";
import SectionContent from "../components/SectionContent";
import { routes } from "../routes";
import { getURLImage } from "../utils/images";
import { notificationsEnum } from "../utils/notificationsType";
// import OpenPay from 'https://js.openpay.mx/openpay.v1.min.js';
// import Openpay from "openpay";

const ProjectPayment = () => {
  const { idService, idPackage } = useParams();
  const [service, setService] = useState(null);
  const [packageData, setPackageData] = useState(null);
  const serviceAmount = 0;
  const userRedux = useSelector((state) => state.user.value);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();
  const toast = useRef(null);

  useEffect(() => {
    const getServiceData = async () => {
      if (!userRedux?.id) {
        navigate(routes.HOME);
        return;
      }
      const response = await ServiceApi.getServiceById(idService);
      setService(response);
      const data = response.packages.filter(
        (p) => p.id === parseInt(idPackage)
      );
      if (data.length > 0) {
        setPackageData(data[0]);
      }
    };
    getServiceData();
  }, [idPackage, idService, navigate, userRedux?.id]);

  const pay = async (data) => {
    try {
      const isProduction = false;
      // OpenPay.setId('mzdtln0bmtms6o3kck8f');
      // OpenPay.setApiKey('pk_f0660ad5a39f4912872e24a7a660370c');
      // var deviceSessionId = OpenPay.deviceData.setup("payment-form", "deviceIdHiddenFieldName");
      // var openpay = new OpenPay('mqq6q0cywvcob5dut6in', ' your sk_6f73a421e6f1464a84e50e9ec980bb2a key ', [ isProduction ]);
      // OpenPay.setId("mqq6q0cywvcob5dut6in");
      // OpenPay.setApiKey("sk_6f73a421e6f1464a84e50e9ec980bb2a");
      // var deviceSessionId = OpenPay.deviceData.setup(
      //   "payment-form",
      //   "deviceIdHiddenFieldName"
      // );
      const deviceSessionId = localStorage.getItem("deviceSessionId");
      const request = {
        ...data,
        freelancerId: service.freelancerId,
        userId: userRedux.id,
        serviceId: service.id,
        packageId: idPackage,
        deviceSessionId,
        email: userRedux.mail,
      };
      var response = await ProjectApi.createService(request);
      await NotificationApi.createNotification(
        service.freelancerId,
        userRedux.id,
        notificationsEnum.NEWPROJECT,
        response
      );
      toast.current.show({
        severity: "success",
        summary: "Nuevo proyecto",
        detail: "Se ha contratado a este freelancer.",
      });
      navigate(
        "/" +
          routes.DASHBOARD_FREELANCER_PROJECTS_DETAIL.replace(":id", response)
      );
    } catch (e) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: e.description,
      });
    }
  };

  const getPackageCardTheme = () => {
    const header = (
      <img alt="Card" src={getURLImage(service.category?.image)} />
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
            {Number(serviceAmount + packageData.cost).toFixed(2)} MXN
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
        {/* </Link> */}
      </>
    );
  };

  return (
    <>
      <CustomSection type="white">
        <SectionContent type="light">
          <div className="columns">
            <div className="column is-7">
              <div className="columns">
                <div className="column is-12">
                  <div className="bkng-tb-cntnt">
                    <div className="pymnts">
                      <form onSubmit={handleSubmit(pay)} id="payment-form">
                        <input type="hidden" name="token_id" id="token_id" />
                        <div className="pymnt-itm card active">
                          <h2>Tarjeta de crédito o débito</h2>
                          <div className="pymnt-cntnt">
                            <div className="card-expl">
                              <div className="credit">
                                <h4>Tarjetas de crédito</h4>
                              </div>
                              <div className="debit">
                                <h4>Tarjetas de débito</h4>
                              </div>
                            </div>
                            <div className="sctn-row mt-6">
                              <div className="sctn-col l mt-6">
                                <label>Nombre del titular</label>
                                <input
                                  type="text"
                                  placeholder="Como aparece en la tarjeta"
                                  autocomplete="off"
                                  data-openpay-card="holder_name"
                                  {...register("holderName", {
                                    required: true,
                                  })}
                                />
                                {errors.holderName && (
                                  <span className="error-validation">
                                    Este campo es requerido
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="sctn-row mt-0">
                              <div className="sctn-col mt-6">
                                <label>Número de tarjeta</label>
                                <input
                                  type="text"
                                  autocomplete="off"
                                  data-openpay-card="card_number"
                                  maxLength={16}
                                  {...register("cardNumber", {
                                    required: true,
                                  })}
                                />
                                {errors.cardNumber && (
                                  <span className="error-validation">
                                    Este campo es requerido
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="sctn-row">
                              <div className="sctn-col l">
                                <label>Fecha de expiración</label>
                                <div className="sctn-col half l">
                                  <input
                                    type="text"
                                    placeholder="Mes"
                                    maxLength={2}
                                    data-openpay-card="expiration_month"
                                    {...register("expirationMonth", {
                                      required: true,
                                    })}
                                  />
                                </div>
                                <div className="sctn-col half l">
                                  <input
                                    type="text"
                                    placeholder="Año"
                                    data-openpay-card="expiration_year"
                                    maxLength={2}
                                    {...register("expirationYear", {
                                      required: true,
                                    })}
                                  />
                                </div>
                              </div>
                              <div className="sctn-col cvv">
                                <label>Código de seguridad</label>
                                <div className="sctn-col half l">
                                  <input
                                    type="password"
                                    placeholder="3 dígitos"
                                    autocomplete="off"
                                    data-openpay-card="cvv2"
                                    maxLength={4}
                                    {...register("cvv2", { required: true })}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="openpay">
                              <div className="logo">
                                Transacciones realizadas vía:
                              </div>
                              <div className="shield">
                                Tus pagos se realizan de forma segura con
                                encriptación de 256 bits
                              </div>
                            </div>
                            {/* <div className="sctn-row">
                              <a className="button rght" id="pay-button">
                                Pagar
                              </a>
                            </div> */}
                          </div>
                        </div>
                        <input
                          className="button is-link"
                          style={{ width: "100%" }}
                          type="submit"
                          value={"Pagar"}
                        />
                      </form>
                    </div>
                  </div>
                </div>
              </div>
              <div className="columns">
                <div className="column  is-half is-offset-one-quarter has-text-centered">
                  {/* Pagar
                  </input> */}
                  <p className="mt-3">
                    Al hacer click en PAGAR, aceptas los{" "}
                    <Link className="has-text-link">
                      Términos y Condiciones
                    </Link>
                  </p>
                </div>
              </div>
            </div>
            <div className="column is-5">
              {service && getPackageCardTheme()}
            </div>
          </div>
        </SectionContent>
      </CustomSection>
      <Toast ref={toast} />
    </>
  );
};

export default ProjectPayment;
