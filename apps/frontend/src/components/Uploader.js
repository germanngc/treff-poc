import { Dialog } from "primereact/dialog";
import { useEffect, useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { Link } from "react-router-dom";
import { getURLImage } from "../utils/images";
import ImageEditor from "./ImageEditor";

const Uploader = (props) => {
  const fileTypes = ["JPG", "PNG", "GIF"];
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [displayImage, setDisplayImage] = useState(false);

  useEffect(() => {
    const setInitialFiles = () => {
      setFiles(props.files || []);
    };
    setInitialFiles();
  }, [props.files]);

  const handleChange = (file) => {
    setFile(file);
   setDisplayImage(true);
  };

  const deleteElement = (index) => {
    const data = [...files];
    data.splice(index, 1);
    setFiles(data);
    props.setFiles(data);
  };

  const addPhoto = (base64) => {
    const request = {
      file: base64,
      fileName: file.name,
    };
    const filesData = [...files];
    filesData.push(request);
    setFiles(filesData);
    props.setFiles(filesData);
    setDisplayImage(false)
  };

  return (
    <>
      <FileUploader
        children={
          <div className="columns uploader">
            <div className="column is-vcenterd has-text-centered pt-6">
              <img
                src={getURLImage("images/imageUpload.png", true)}
                alt="success"
              />
              <p className="text-16-gray">Arrastra y suelta aquí</p>
            </div>
          </div>
        }
        handleChange={handleChange}
        name="file"
        types={fileTypes}
        hoverTitle="Suelta aquí"
      />
      <br />
      <br />
      {files.map((f, index) => (
        <div key={index} className="columns" style={{ border: "1px solid #BFBFBF" }}>
          <div className="column">
            <img
              src={f.file || URL.createObjectURL(f)}
              style={{ maxWidth: "200px", maxHeight: "80px" }}
              alt="file"
            />
          </div>
          <div className="column is-vcentered">{f.name || f.fileName}</div>
          <div className="column is-vcentered">
            <Link onClick={() => deleteElement(index)}>
              <img
                src={process.env.PUBLIC_URL + "/images/delete.png"}
                width="20"
                height={"40"}
                className="ml-4"
                alt="Borrar pregunta"
              />
            </Link>
          </div>
        </div>
      ))}
      <Dialog
        header="Edita tu foto de perfil"
        visible={displayImage}
        // style={{ width: "80vw" }}
        onHide={() => setDisplayImage(false)}
        breakpoints={{ "1024px": "75vw", "960px": "75vw", "640px": "100vw" }}
      >
        <ImageEditor image={file} getImge={addPhoto} />
      </Dialog>
    </>
  );
};

export default Uploader;
