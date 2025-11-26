import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import SectionContent from "../SectionContent";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { addNewService } from "../../redux/serviceReducer";
import { routes } from "../../routes";
import { InputNumber } from "primereact/inputnumber";

const NewServicePrice = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const [activeIndex, setActiveIndex] = useOutletContext();
  const service = useSelector((state) => state.service.new);
  const packages = service?.packages || [];
  const [time, setTime] = useState(packages.length > 0 ? service?.packages[0]?.time : 1);
  const [timePremium, setTimePremium] = useState(packages.length > 0 ? service?.packages[1]?.time : 1);
  const [numReviews, setNumReviews] = useState(packages.length > 0 ? service?.packages[0]?.numReviews : 1);
  const [numReviewsPremium, setNumReviewsPremium] = useState(packages.length > 0 ? service?.packages[1]?.numReviews : 1);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      basic: packages.length > 0 ? service?.packages[0] : {},
      premium: packages.length > 0 ? service?.packages[1] : {},
    },
  });

  const next = (data) => {
    let serviceData = { ...service } || {};
    serviceData.packages = [];
    data.basic.name = "Básico";
    data.premium.name = "Premium";
    data.basic.time = time;
    data.premium.time = timePremium;
    data.basic.numReviews = numReviews;
    data.premium.numReviews = numReviewsPremium;
    serviceData.packages.push(data.basic);
    data.premium.premium = true;
    serviceData.packages.push(data.premium);
    // serviceData.categoryId = data.categoryId;
    // serviceData.categoryMainId = categoryMainId;
    // serviceData.keyWords = values2.join(",");

    dispatch(addNewService(serviceData));
    setActiveIndex(2);
    navigate(
      "/" +
        routes.DASHBOARD_FREELANCER +
        "/" +
        routes.DASHBOARD_SERVICENEW +
        "/" +
        routes.DASHBOARD_SERVICENEW_DESCRIPTION
    );
  };

  const updateTime = (packageName, e) => {
    if (packageName === "premium") {
      setTimePremium(e.value);
      return;
    }
    setTime(e.value);
  };

  const updateNumReviews = (packageName, e) => {
    if (packageName === "premium") {
      setNumReviewsPremium(e.value);
      return;
    }
    setNumReviews(e.value);
  };

  const editPackage = (packageName, title) => {
    return (
      <>
        {/* <div className="column is-4"> */}
        <div className="columns is-multiline">
          <div className="column is-full">
            <p className="text-black">{title}</p>
          </div>
          {/* <div className="column is-full p-0">
            <div className="field">
              <div className="control">
                <textarea
                  {...register(`${packageName}.name`, { required: true })}
                  className="textarea"
                  placeholder="Nombre del paquete"
                ></textarea>
                {errors[packageName]?.name && (
                  <span className="error-validation">
                    Este campo es requerido
                  </span>
                )}
              </div>
            </div>
          </div> */}
          <div className="column is-full p-0">
            <div className="field">
              <div className="control">
                <textarea
                  {...register(`${packageName}.description`, {
                    required: true,
                  })}
                  className="textarea"
                  placeholder="Describe con detalle tu ofrecimiento"
                ></textarea>
              </div>
              {errors[packageName]?.description && (
                <span className="error-validation">
                  Este campo es requerido
                </span>
              )}
            </div>
          </div>
          <div className="column is-full p-0">
            <div className="card p-fluid has-text-left p-4">
              <p className="text-12-gray mb-4">Tiempo de entrega</p>
              <InputNumber
                inputId="stacked"
                value={packageName === "premium" ? timePremium : time}
                onValueChange={(e) => updateTime(packageName, e)}
                showButtons
                //   {...register(`${packageName}.time`, {
                //     required: true,
                //   })}
                // mode="currency"
                // currency="USD"
              />
            </div>
          </div>
          <div className="column is-full p-0">
            <div className="card p-fluid has-text-left p-4">
              <p className="text-12-gray mb-4">Número de Revisiones</p>
              <InputNumber
                inputId="stacked"
                value={
                  packageName === "premium" ? numReviewsPremium : numReviews
                }
                onValueChange={(e) => updateNumReviews(packageName, e)}
                showButtons
                //   {...register(`${packageName}.time`, {
                //     required: true,
                //   })}
                // mode="currency"
                // currency="USD"
              />
            </div>
          </div>
          <div className="column is-full p-0 mb-4">
            <div className="card p-fluid has-text-left p-4">
              <p className="text-12-gray mb-4">Valor</p>
              <div className="columns">
                <div className="column p-0 pr-1">
                  <div className="control">
                    <input
                      {...register(`${packageName}.cost`, {
                        required: true,
                      })}
                      className="input"
                      type="number"
                      placeholder=""
                    />
                    {errors[packageName]?.cost && (
                      <span className="error-validation">
                        Este campo es requerido
                      </span>
                    )}
                  </div>
                </div>
                <div className="column p-0">
                  <div className="control">
                    <div className="select">
                      <select
                        {...register(`${packageName}.currency`, {
                          required: true,
                        })}
                      >
                        <option value={"MXN"}>MXN</option>
                        <option value={"USD"}>USD</option>
                      </select>
                    </div>
                    {errors[packageName]?.currency && (
                      <span className="error-validation">
                        Este campo es requerido
                      </span>
                    )}
                  </div>
                </div>
                <br />
              </div>
            </div>
          </div>
        </div>
        {/* </div> */}
      </>
    );
  };

  return (
    <>
      <SectionContent type="light">
        <form onSubmit={handleSubmit(next)}>
          <div className="columns">
            <div className="column is-10 is-offset-1">
              <div className="columns has-text-centered">
                <div className="column is-4">Descripción</div>
                <div className="column is-4">
                  {editPackage("basic", "Básico")}
                </div>
                <div className="column is-4">
                  {editPackage("premium", "Premium")}
                </div>
              </div>
            </div>
          </div>

          <div className="control mt-6 has-text-centered">
            <input
              type={"submit"}
              className="button is-success"
              style={{ width: "100%" }}
              value="Guardar y continuar"
            />
          </div>

          {/* <button onClick={() => setActiveIndex(1)}>Next</button> */}
        </form>
      </SectionContent>
    </>
  );
};

export default NewServicePrice;
