import { useState } from "react";
// import { useEffect } from "react";
// import { CountriesApi } from "../../api";
import { Calendar } from "primereact/calendar";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { useForm } from "react-hook-form";
import { FreelancerApi } from "../../api";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Link } from "react-router-dom";
import { useRef } from "react";
import { Toast } from "primereact/toast";
import SectionContent from "../SectionContent";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../../redux/userReducer";

const Certification = () => {
  //   const [countries, setCountries] = useState([]);
  const dispatch = useDispatch();
  const userRedux = useSelector((state) => state.user.value);
  const user = {...userRedux};
  const [date10, setDate10] = useState(null);
  const [certifications, setCertifications] = useState(user.certifications || []);
  const [selectedProducts7, setSelectedProducts7] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const toast = useRef(null);
  const updateEducations = async (certificationsRequest) => {
    const request = {
      certifications: certificationsRequest,
      id: user.id,
    };
    const certificationsResponse = await FreelancerApi.updateCertifications(request);
    user.certifications = certificationsResponse;
    dispatch(addUser(user));
  };

  const update = async (data) => {
    data.freelancerId = user.id;
    data.year = data.year.getFullYear();

    const educationsTemp = [...certifications];
    educationsTemp.push(data);

    setCertifications(educationsTemp);
    await updateEducations(educationsTemp);
    reset();
    toast.current.show({ severity: "success", summary: "Registro agregado" });
  };

  const onRowEditComplete1 = async (e) => {
    let educationsTemp = [...certifications];
    let { newData, index } = e;

    educationsTemp[index] = newData;

    setCertifications(educationsTemp);
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
    const educationsTemp = certifications.filter((e) => e.id !== rowData.id);
    setCertifications(educationsTemp);
    updateEducations(educationsTemp);
    toast.current.show({ severity: "success", summary: "Registro borrado" });
  };

  const confirm = (rowData) => {
    confirmDialog({
      message: "¿Deseas borrar este registro?",
      header: "Confirmación de borrado",
      icon: "pi pi-info-circle",
      acceptClassName: "p-button-danger",
      accept: () => rowColumnClick(rowData),
    });
  };

  return (
    <>
      <SectionContent type="light">
        <div className="pb-6">
          <div className="has-text-centered is-hidden-widescreen">
            <p className="p-18-dark">
              <b>Certificación</b>
            </p>
          </div>
          <form onSubmit={handleSubmit(update)}>
          <div className="field">
              <div className="control">
                <input
                  {...register("name", { required: true })}
                  className="input"
                  type="text"
                  placeholder="Título de certificación"
                />
                {errors.name && (
                  <span className="error-validation">
                    Este campo es requerido
                  </span>
                )}
              </div>
            </div>

            <div className="field">
              <div className="control">
                <input
                  {...register("institute", { required: true })}
                  className="input"
                  type="text"
                  placeholder="Institución que certifica"
                />
                {errors.institute && (
                  <span className="error-validation">
                    Este campo es requerido
                  </span>
                )}
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
          value={certifications}
          selection={selectedProducts7}
          onSelectionChange={(e) => setSelectedProducts7(e.value)}
          editMode="row"
          dataKey="id"
          onRowEditComplete={onRowEditComplete1}
          responsiveLayout="scroll"
        >
          <Column
            rowEditor
            headerStyle={{ width: "8%", minWidth: "8rem" }}
            bodyStyle={{ textAlign: "center" }}
          ></Column>
          <Column
            headerStyle={{ width: "6%", minWidth: "5rem" }}
            body={dateTemplate}
          />
          {/* CAMPOS */}
          <Column
            field="name"
            header="Título"
            editor={(options) => textEditor(options)}
            style={{ width: "20%" }}
          ></Column>
          <Column
            field="institute"
            header="Institución"
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

export default Certification;
