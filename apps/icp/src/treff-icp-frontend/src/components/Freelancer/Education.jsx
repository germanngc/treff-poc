import { useState } from "react";
// import { useEffect } from "react";
// import { CountriesApi } from "../../api";
import { Calendar } from "primereact/calendar";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { useForm } from "react-hook-form";
import { FreelancerApi } from "../../api";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Link } from "react-router-dom";
import { useRef } from "react";
import { Toast } from "primereact/toast";
import SectionContent from "../SectionContent";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../../redux/userReducer";

const Education = () => {
  //   const [countries, setCountries] = useState([]);
  const dispatch = useDispatch();
  const userRedux = useSelector((state) => state.user.value);
  const user = {...userRedux};
  const [date10, setDate10] = useState(null);
  const [educations, setEducations] = useState(user.educations || []);
  const [selectedProducts7, setSelectedProducts7] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const statuses = [
    { label: "México", value: "México" },
    { label: "Colombia", value: "Colombia" },
    // { label: "Out of Stock", value: "OUTOFSTOCK" },
  ];

  const titles = [
    { label: "Ingeniero", value: "Ingeniero" },
    { label: "Licenciado", value: "Licenciado" },
    // { label: "Out of Stock", value: "OUTOFSTOCK" },
  ];
  //   useEffect(() => {
  //     const getCountries = async () => {
  //       const response = await CountriesApi.getCountries();
  //       setCountries(response);
  //     };
  //     // getCountries();
  //   }, []);
  const toast = useRef(null);
  const updateEducations = async (educationsRequest) => {
    const request = {
      educations: educationsRequest,
      id: user.id,
    };
    const educationResponse = await FreelancerApi.updateEducations(request);
    user.educations = educationResponse;
    dispatch(addUser(user));
  };

  const update = async (data) => {
    data.freelancerId = user.id;
    data.year = data.year.getFullYear();

    const educationsTemp = [...educations];
    educationsTemp.push(data);

    setEducations(educationsTemp);
    await updateEducations(educationsTemp);
    reset();
    toast.current.show({ severity: "success", summary: "Registro agregado" });
  };

  const onRowEditComplete1 = async (e) => {
    let educationsTemp = [...educations];
    let { newData, index } = e;

    educationsTemp[index] = newData;

    setEducations(educationsTemp);
    await updateEducations(educationsTemp);
    toast.current.show({ severity: "success", summary: "Registro modificado" });
  };
  const textEditor = (options) => {
    return (
      <InputText
        type="text"
        value={options.value}
        onChange={(e) => options.editorCallback(e.target.value)}
      />
    );
  };

  const statusEditor = (options) => {
    return (
      <Dropdown
        value={options.value}
        options={statuses}
        optionLabel="label"
        optionValue="value"
        onChange={(e) => options.editorCallback(e.value)}
        placeholder="Selecciona un país"
        itemTemplate={(option) => {
          return (
            <span
              className={`product-badge status-${option.value.toLowerCase()}`}
            >
              {option.label}
            </span>
          );
        }}
      />
    );
  };

  const titleEditor = (options) => {
    return (
      <Dropdown
        value={options.value}
        options={titles}
        optionLabel="label"
        optionValue="value"
        onChange={(e) => options.editorCallback(e.value)}
        placeholder="Selecciona un título"
        itemTemplate={(option) => {
          return (
            <span
              className={`product-badge status-${option.value.toLowerCase()}`}
            >
              {option.label}
            </span>
          );
        }}
      />
    );
  };

  const priceEditor = (options) => {
    return (
      <InputNumber
        value={options.value}
        onValueChange={(e) => options.editorCallback(e.value)}
      />
    );
  };

  const priceBodyTemplate = (rowData) => {
    return rowData.year;
  };

  const dateTemplate = (rowData, column) => {
    return (
      <div>
        <Link onClick={() => confirm(rowData)}>
          <img
            src={"/images/delete.png"}
            width="30"
            height={"50"}
            alt="profile"
          />
        </Link>
      </div>
    );
  };

  const rowColumnClick = (rowData) => {
    const educationsTemp = educations.filter((e) => e.id !== rowData.id);
    setEducations(educationsTemp);
    updateEducations(educationsTemp);
    toast.current.show({ severity: "success", summary: "Registro borrado" });
  };

  const confirm = (rowData) => {
    // setRowToDelete(rowData);
    confirmDialog({
      message: "¿Deseas borrar este registro?",
      header: "Confirmación de borrado",
      icon: "pi pi-info-circle",
      acceptClassName: "p-button-danger",
      accept: () => rowColumnClick(rowData),
      // rowColumnClick
    });
  };

  return (
    <>
      <SectionContent type="light">
        <div className="pb-6">
          <div className="has-text-centered is-hidden-widescreen">
            <p className="p-18-dark">
              <b>Educación</b>
            </p>
          </div>
          <form onSubmit={handleSubmit(update)}>
            <div className="field">
              {/* <label className="label">Subject</label> */}
              <div className="control">
                <div className="select">
                  <select {...register("country", { required: true })}>
                    <option>País de estudios</option>
                    <option value={"México"}>México</option>
                    <option value={"Colombia"}>Colombia</option>
                  </select>
                </div>
                {errors.country && (
                  <span className="error-validation">
                    Este campo es requerido
                  </span>
                )}
              </div>
            </div>
            <div className="field">
              <div className="control">
                <input
                  {...register("university", { required: true })}
                  className="input"
                  type="text"
                  placeholder="Nombre de universidad"
                />
                {errors.university && (
                  <span className="error-validation">
                    Este campo es requerido
                  </span>
                )}
              </div>
            </div>
            <div className="columns is-multiline">
              <div className="column is-3-widescreen is-full-desktop">
                <div className="field">
                  {/* <label className="label">Subject</label> */}
                  <div className="control">
                    <div className="select">
                      <select {...register("title", { required: true })}>
                        <option>Titulo</option>
                        <option value={"Ingeniero"}>Ingeniero</option>
                        <option value={"Licenciado"}>Licenciado</option>
                      </select>
                    </div>
                    {errors.title && (
                      <span className="error-validation">
                        Este campo es requerido
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="column is-9-widescreen is-full-desktop">
                <div className="field">
                  <div className="control">
                    <input
                      {...register("titleName", { required: true })}
                      className="input"
                      type="text"
                      placeholder="Nombre título"
                    />
                  </div>
                  {errors.titleName && (
                    <span className="error-validation">
                      Este campo es requerido
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="field col-12 md:col-4">
              <label htmlFor="yearpicker">Año</label>
              <br />
              <Calendar
                id="yearpicker"
                value={date10}
                onChange={(e) => setDate10(e.value)}
                view="year"
                dateFormat="yy"
                maxDate={new Date()}
                {...register("year", { required: true })}
              />
              {errors.year && (
                <span className="error-validation">
                  Este campo es requerido
                </span>
              )}
            </div>
            <div className="control mt-6 has-text-centered">
              <input
                type={"submit"}
                // onClick={() => update()}
                className="button is-success"
                style={{ width: "100%" }}
                value="Agregar"
              />
            </div>
          </form>
        </div>
      </SectionContent>
      <div className="card p-fluid mb-4">
        <DataTable
          selectionMode="checkbox"
          value={educations}
          selection={selectedProducts7}
          onSelectionChange={(e) => setSelectedProducts7(e.value)}
          editMode="row"
          dataKey="id"
          onRowEditComplete={onRowEditComplete1}
          responsiveLayout="scroll"
        >
          {/* <Column
              selectionMode="multiple"
              headerStyle={{ width: "3em" }}
            ></Column> */}
          <Column
            rowEditor
            headerStyle={{ width: "8%", minWidth: "8rem" }}
            bodyStyle={{ textAlign: "center" }}
          ></Column>
          <Column
            headerStyle={{ width: "6%", minWidth: "5rem" }}
            body={dateTemplate}
          />
          <Column
            field="country"
            header="País"
            // body={statusBodyTemplate}
            editor={(options) => statusEditor(options)}
            style={{ width: "20%" }}
          ></Column>
          <Column
            field="university"
            header="Universidad"
            editor={(options) => textEditor(options)}
            style={{ width: "20%" }}
          ></Column>
          <Column
            field="title"
            header="Título"
            editor={(options) => titleEditor(options)}
            style={{ width: "20%" }}
          ></Column>

          <Column
            field="titleName"
            header="Nombre de Título"
            editor={(options) => textEditor(options)}
            style={{ width: "20%" }}
          ></Column>

          <Column
            field="year"
            header="Año"
            body={priceBodyTemplate}
            editor={(options) => priceEditor(options)}
            style={{ width: "20%" }}
          ></Column>
        </DataTable>
      </div>
      <ConfirmDialog />
      <Toast ref={toast}></Toast>
    </>
  );
};

export default Education;
