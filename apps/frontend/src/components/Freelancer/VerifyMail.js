import { Toast } from "primereact/toast";
import { useRef } from "react";
import { FreelancerApi } from "../../api";
import { useForm } from "react-hook-form";
import SectionContent from "../SectionContent";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useEffect } from "react";
import { getURLImage } from "../../utils/images";

const VerifyMail = () => {
  // const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);
  const [waitVerification, setWaitVerification] = useState(false);
  const [mail, setMail] = useState(false);
  const [code, setCode] = useState();
  const [validated, setValidated] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user.name,
      // phone: user.phone,
      mail: user.mail,
    },
  });

  useEffect(() => {
    const checkVerification = () => {
      const data = user.verifications.filter(
        (v) => v.value === user.mail && v.verificated
      );
      if (data.length > 0) {
        setValidated(true);
      }
    };
    checkVerification();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // const disabled = waitVerification ? "disabled" : null;
  const toast = useRef(null);

  const update = async (formData) => {
    const userData = { ...user };
    // userData.name = formData.name;
    userData.mail = formData.mail;
    setMail(userData.mail);
    // userData.mail = formData.mail;
    const data = await FreelancerApi.validateMail({
      id: userData.id,
      mail: userData.mail,
    });
    // dispatch(addUser(data));
    if (data.success) {
      toast.current.show({
        severity: "success",
        summary: "Se envió el SMS correctamente",
      });
      setWaitVerification(true);
    } else {
      toast.current.show({
        severity: "error",
        summary: data.message,
      });
    }
  };

  const verify = async () => {
    const userData = { ...user };
    const request = {
      id: userData.id,
      value: mail,
      code,
    };
    // userData.name = formData.name;
    // userData.mail = formData.mail;
    const data = await FreelancerApi.validateCode(request);
    // dispatch(addUser(data));
    if (data.success) {
      toast.current.show({
        severity: "success",
        summary: data.message,
      });
      setValidated(true);
    } else {
      toast.current.show({
        severity: "error",
        summary: data.message,
      });
    }
  };

  return (
    <>
      <SectionContent type="light">
        <div className="pb-6">
          <div className="has-text-centered mb-4 is-hidden-widescreen">
            <p className="p-18-dark">
              <b>Verificar Email</b>
            </p>
          </div>

          {validated && (
            <div className="has-text-centered p-4">
              <img
                src={getURLImage("images/success.png", true)}
                alt="success"
              />
              <p className="subtitle-dark mt-4">Email verificado</p>
            </div>
          )}
          <form onSubmit={handleSubmit(update)}>
            <div className="field">
              <label className="label">Email</label>
              <div className="control">
                <input
                  disabled={true}
                  {...register("mail", { required: true })}
                  className="input"
                  type="mail"
                  placeholder="Email"
                />
                {errors.mail && (
                  <span className="error-validation">
                    Este campo es requerido
                  </span>
                )}
              </div>
            </div>

            <div className="control mt-6 has-text-centered">
              <input
                disabled={waitVerification || validated}
                type={"submit"}
                // onClick={() => update()}
                className="button is-success"
                style={{ width: "100%" }}
                value="Enviar Email"
              />
            </div>
          </form>
          {waitVerification && !validated && (
            <div className="mt-6">
              <div className="field">
                <label className="label">Código</label>
                <div className="control">
                  <input
                    {...register("code", { required: true })}
                    className="input"
                    type="text"
                    placeholder="Código"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                  />
                  {errors.code && (
                    <span className="error-validation">
                      Este campo es requerido
                    </span>
                  )}
                </div>
              </div>

              <div className="control mt-6 has-text-centered">
                <input
                  type={"submit"}
                  onClick={() => verify()}
                  className="button is-success"
                  style={{ width: "100%" }}
                  value="Validar email"
                />
              </div>
            </div>
          )}
        </div>
        <Toast ref={toast}></Toast>
      </SectionContent>
    </>
  );
};

export default VerifyMail;
