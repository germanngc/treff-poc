import { useRef, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import SectionContent from "../SectionContent";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { addNewService } from "../../redux/serviceReducer";
import { routes } from "../../routes";
import { Toast } from "primereact/toast";
import Uploader from "../Uploader";
import { useEffect } from "react";
import { getURLImage } from "../../utils/images";

const NewServiceFiles = () => {
  const toast = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const [activeIndex, setActiveIndex] = useOutletContext();
  const serviceRedux = useSelector((state) => state.service.new);
  const [files, setFiles] = useState(serviceRedux?.files || []);
  const [service, setService] = useState(serviceRedux);

  const { handleSubmit } = useForm({
    defaultValues: {},
  });

  useEffect(() => {
    const checkImages = () => {
      if (
        !service.files &&
        service.serviceImages &&
        service.serviceImages.length > 0
      ) {
        const filesData = [...files];
        service.serviceImages.forEach((img) => {
          const imgData = {
            fileName: img.image,
            file: getURLImage(img.image),
          };
          filesData.push(imgData);
        });
        setFiles(filesData);
        let serviceData = { ...service } || {};
        serviceData.files = filesData;

        dispatch(addNewService(serviceData));
      }
    };
    checkImages();
  }, []);

  useEffect(() => {
    setService(serviceRedux);
  }, [serviceRedux]);

  const next = async () => {
    let serviceData = { ...service } || {};
    let request = [];

    for (const element of files) {
      if (element.name) {
        const file = {
          fileName: element.name,
          file: await toBase64(element),
        };
        request.push(file);
      } else {
        request.push(element);
      }
    }

    serviceData.files = request;

    dispatch(addNewService(serviceData));
    setActiveIndex(5);
    navigate(
      "/" +
        routes.DASHBOARD_FREELANCER +
        "/" +
        routes.DASHBOARD_SERVICENEW +
        "/" +
        routes.DASHBOARD_SERVICENEW_PUBLISH
    );
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  return (
    <>
      <SectionContent type="light">
        <Toast ref={toast}></Toast>
        <form onSubmit={handleSubmit(next)}>
          <p className="text-dark">Galería</p>
          <p className="text-16-gray">
            Muestre sus servicios en una galería de conciertos Anime a los
            compradores a elegir su Gig presentando una variedad de su trabajo.
            Guardar y continuar pautas de imagen del Servicio para ayudarte a
            tener éxito en la plataforma.
          </p>
          <p className="text-dark mt-6">Imágenes </p>
          <p className="text-16-gray">
            Hágase notar por los compradores correctos con ejemplos visuales de
            sus servicios.
          </p>

          <div className="p-4">
            <Uploader setFiles={setFiles} files={service?.files} />
          </div>

          <div className="control mt-6 has-text-centered">
            <input
              type={"submit"}
              className="button is-success"
              style={{ width: "100%" }}
              value="Guardar y continuar"
            />
          </div>
        </form>
      </SectionContent>
    </>
  );
};

export default NewServiceFiles;
