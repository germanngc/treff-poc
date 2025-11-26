// import { useRef } from "react";
import { useState } from "react";
import AvatarEditor from "react-avatar-editor";

const ImageEditor = (props) => {
  const [scale, setScale] = useState(1);
  //   const editor = useRef(null);
  let editor = "";

  const handleScale = (e) => {
    const scale = parseFloat(e.target.value);
    setScale(scale);
  };

  const save = () => {
    if (setEditorRef) {
      const canvasScaled = editor.getImageScaledToCanvas();
      const croppedImg = canvasScaled.toDataURL();
      //   const image = editor.getImage();
      //   console.log(croppedImg);
      props.getImge(croppedImg);
    }
  };

  const setEditorRef = (ed) => {
    editor = ed;
  };

  return (
    <>
      <div className="has-text-centered image-editor">
        {props.isAvatar ? (
          <AvatarEditor
            ref={setEditorRef}
            image={props?.image}
            width={250}
            height={250}
            border={50}
            color={[255, 255, 255, 0.6]} // RGBA
            scale={parseFloat(scale)}
            rotate={0}
            borderRadius={125}
          />
        ) : props.isCover ? (
          <AvatarEditor
            ref={setEditorRef}
            image={props?.image}
            width={820}
            height={312}
            border={50}
            color={[255, 255, 255, 0.6]} // RGBA
            scale={parseFloat(scale)}
            rotate={0}
          />
        ) : (
          <AvatarEditor
            ref={setEditorRef}
            image={props?.image}
            width={480}
            height={320}
            border={50}
            color={[255, 255, 255, 0.6]} // RGBA
            scale={parseFloat(scale)}
            rotate={0}
          />
        )}
        <br />
        Zoom:
        <br />
        <input
          name="scale"
          type="range"
          onChange={handleScale}
          min={"1"}
          max="2"
          step="0.01"
          defaultValue="1"
        />
        <div className="control mt-6 has-text-centered pl-6 pr-6 ml-6 mr-6">
          <button
            onClick={() => save()}
            className="button is-success"
            style={{ width: "100%" }}
          >
            Agregar
          </button>
        </div>
      </div>
    </>
  );
};

export default ImageEditor;
