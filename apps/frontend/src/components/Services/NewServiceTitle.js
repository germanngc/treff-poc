import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { CategoryApi } from "../../api";
import SectionContent from "../SectionContent";
import { useForm } from "react-hook-form";
import { Chips } from "primereact/chips";
import { useDispatch, useSelector } from "react-redux";
import { addNewService } from "../../redux/serviceReducer";
import { routes } from "../../routes";
import { Editor } from "primereact/editor";

const NewServiceTitle = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const [activeIndex, setActiveIndex] = useOutletContext();
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const service = useSelector((state) => state.service.new);
  const [description, setDescription] = useState(service?.description || "");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: service?.name || "",
      categoryId: service?.categoryId || "",
    },
  });
  const [categoryMainId, setCategoryMainId] = useState(
    service?.categoryMainId || ""
  );
  const chips = service?.keyWords?.split(",") || [];
  const [values2, setValues2] = useState(chips);
  useEffect(() => {
    const getCategories = async () => {
      const cat = await CategoryApi.getCategories();
      setCategories(cat);
      loadSubCategories(service?.categoryMainId || "", cat);
      reset({ categoryId: service?.categoryId });
    };
    getCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadSubCategories = (value, cats) => {
    const categoriesData = cats ? cats : categories;
    const currentCat = categoriesData.filter((c) => c.id === parseInt(value));
    if (currentCat.length > 0) {
      setCategoryMainId(parseInt(value));
      setSubcategories(currentCat[0].subCategories);
    }
  };

  const next = (data) => {
    if (!description) {
      return null;
    }
    let serviceData = { ...service } || {};
    serviceData.name = data.name;
    serviceData.categoryId = data.categoryId;
    serviceData.categoryMainId = categoryMainId;
    serviceData.description = description;
    serviceData.keyWords = values2.join(",");

    dispatch(addNewService(serviceData));
    setActiveIndex(1);
    navigate(
      "/" +
        routes.DASHBOARD_FREELANCER +
        "/" +
        routes.DASHBOARD_SERVICENEW +
        "/" +
        routes.DASHBOARD_SERVICENEW_PRICE
    );
  };

  return (
    <>
      <SectionContent type="light">
        <form onSubmit={handleSubmit(next)}>
          <p className="plan-title">Título de tu servicio</p>
          <div className="field">
            <div className="control">
              <input
                {...register("name", { required: true })}
                className="input"
                // placeholder="e.g. Hello world"
              />
            </div>
            {errors.name && (
              <span className="error-validation">Este campo es requerido</span>
            )}
          </div>

          <p className="plan-title mb-2 mt-4">Descripción</p>
          <Editor
            style={{ height: "320px" }}
            value={description}
            onTextChange={(e) => setDescription(e.htmlValue)}
            placeholder="Realice brevemente una descripción de su servicio."
          />
          {!description && (
            <span className="error-validation">Este campo es requerido</span>
          )}

          <div className="field mt-4">
            <div className="control">
              <div className="select">
                <select
                  value={categoryMainId}
                  onChange={(e) => loadSubCategories(e.target.value)}
                >
                  <option>Categoría</option>
                  {categories.map((c, index) => (
                    <option key={index} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="select">
                <select {...register("categoryId", { required: true })}>
                  <option>SubCategoría</option>
                  {subcategories.map((c, index) => (
                    <option key={index} value={c.id}>{c.name}</option>
                  ))}
                </select>
                {errors.categoryId && (
                  <span className="error-validation">
                    Este campo es requerido
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="card p-fluid mt-6">
            <Chips
              placeholder="Palabras clave"
              value={values2}
              onChange={(e) => setValues2(e.value)}
              separator=","
            />
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

export default NewServiceTitle;
