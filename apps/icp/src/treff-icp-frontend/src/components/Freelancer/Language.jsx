import { useState } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
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

const Language = () => {
  const dispatch = useDispatch();
  const userRedux = useSelector((state) => state.user.value);
  const user = {...userRedux};
  const [languages, setLanguages] = useState(user.languages || []);
  const [selectedProducts7, setSelectedProducts7] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm();
  const statuses = [
    { label: "Básico", value: "Básico" },
    { label: "Intermedio", value: "Intermedio" },
    { label: "Avanzado - Nativo", value: "Avanzado - Nativo" },
  ];

  const toast = useRef(null);
  const updateEducations = async (languagesRequest) => {
    const request = {
      languages: languagesRequest,
      id: user.id,
    };
    const languageResponse = await FreelancerApi.updateLanguages(request);
    user.languages = languageResponse;
    dispatch(addUser(user));
  };

  const update = async (data) => {
    if (!data.level) {
      setError("username", {
        type: "required",
        message: "Este campo es requerido",
      });
      return;
    }
    data.freelancerId = user.id;

    const educationsTemp = [...languages];
    educationsTemp.push(data);

    setLanguages(educationsTemp);
    await updateEducations(educationsTemp);
    reset();
    toast.current.show({ severity: "success", summary: "Registro agregado" });
  };

  const onRowEditComplete1 = async (e) => {
    let educationsTemp = [...languages];
    let { newData, index } = e;

    educationsTemp[index] = newData;

    setLanguages(educationsTemp);
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
        placeholder="Selecciona un nivel"
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

  const deleteTemplate = (rowData, column) => {
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
    const educationsTemp = languages.filter((e) => e.id !== rowData.id);
    setLanguages(educationsTemp);
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
          <div className="has-text-centered is-hidden-widescreen mb-4">
            <p className="p-18-dark">
              <b>Idiomas</b>
            </p>
          </div>
          <form onSubmit={handleSubmit(update)}>
            <div className="field">
              <div className="control">
                <input
                  {...register("name", { required: true })}
                  className="input"
                  type="text"
                  placeholder="Idioma"
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
                <div className="select">
                  <select {...register("level", { required: true })}>
                    <option value={""}>Nivel de Idioma</option>
                    <option value={"Básico"}>Básico</option>
                    <option value={"Intermedio"}>Intermedio</option>
                    <option value={"Avanzado - Nativo"}>
                      Avanzado - Nativo
                    </option>
                  </select>
                </div>
                {errors.level && (
                  <span className="error-validation">
                    Este campo es requerido
                  </span>
                )}
              </div>
            </div>

            <div className="control mt-6 has-text-centered">
              <input
                type={"submit"}
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
          value={languages}
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
            body={deleteTemplate}
          />
          <Column
            field="name"
            header="Idioma"
            editor={(options) => textEditor(options)}
            style={{ width: "20%" }}
          ></Column>
          <Column
            field="level"
            header="Nivel"
            editor={(options) => statusEditor(options)}
            style={{ width: "20%" }}
          ></Column>
        </DataTable>
      </div>
      <ConfirmDialog />
      <Toast ref={toast}></Toast>
    </>
  );
};

export default Language;
