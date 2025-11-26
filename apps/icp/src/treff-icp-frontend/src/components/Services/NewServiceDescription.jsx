import { Link, useNavigate, useOutletContext } from "react-router-dom";
import SectionContent from "../SectionContent";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { addNewService } from "../../redux/serviceReducer";
import { routes } from "../../routes";
import { useState } from "react";
import { useEffect } from "react";

const NewServiceDescription = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const service = useSelector((state) => state.service.new);
  // eslint-disable-next-line no-unused-vars
  const [activeIndex, setActiveIndex] = useOutletContext();
  const [questions, setQuestions] = useState(
    service?.faqs|| [{ question: "", answer: "" }]
  );

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      // description: service?.description || "",
    },
  });

  useEffect(() => {
    const setData = () => {
      if (service?.faqs) {
        const currentData = { question: [], answer: [] };
        currentData.answer = service.faqs.map(f => f.answer);
        currentData.question = service.faqs.map(f => f.question);
        reset(currentData);
      }
    };
    setData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const next = (data) => {
    console.log(data);
    const dataQuestions = [];
    data.question.forEach((q, i) => {
      const dataQuestion = {
        question: q,
        answer: data.answer[i],
      };
      dataQuestions.push(dataQuestion);
    });
    // if(!description){
    //   return null;
    // }
    let serviceData = { ...service } || {};
    serviceData.faqs = dataQuestions;

    dispatch(addNewService(serviceData));
    setActiveIndex(3);
    navigate(
      "/" +
        routes.DASHBOARD_FREELANCER +
        "/" +
        routes.DASHBOARD_SERVICENEW +
        "/" +
        routes.DASHBOARD_SERVICENEW_REQUIREMENTS
    );
  };

  const deleteElement = (index) => {
    const data = [...questions];
    data.splice(index, 1);
    setQuestions(data);

    const question = getValues("question");
    const answer = getValues("answer");

    question.splice(index, 1);
    answer.splice(index, 1);

    reset({
      question,
      answer,
    });
  };

  const questionComponent = (question, index) => {
    return (
      <div key={index}>
        <p className="plan-title mb-2 mt-4">
          Pregunta {index + 1}{" "}
          <Link onClick={() => deleteElement(index)}>
            <img
              src={"/images/delete.png"}
              width="20"
              height={"40"}
              className="ml-4"
              alt="Borrar pregunta"
            />
          </Link>
        </p>
        <div className="field">
          <div className="control">
            <input
              {...register("question[" + index + "]", { required: true })}
              className="input"
              placeholder="Pregunta"
            />
          </div>
          {errors?.question && errors?.question[index] && (
            <span className="error-validation">Este campo es requerido</span>
          )}
        </div>

        <div className="field">
          <div className="control">
            <input
              {...register("answer[" + index + "]", { required: true })}
              className="input"
              placeholder="Respuesta"
            />
          </div>
          {errors?.answer && errors?.answer[index] && (
            <span className="error-validation">Este campo es requerido</span>
          )}
        </div>
      </div>
    );
  };

  const addQuestion = () => {
    const data = [...questions];
    data.push({ question: "", answer: "" });
    setQuestions(data);
  };

  return (
    <>
      <SectionContent type="light">
        <form onSubmit={handleSubmit(next)}>
          <p className="text-dark mb-4">Preguntas frecuentes (FAQ)</p>
          <p className="text-16-gray mb-4">
            Agregue preguntas para ayudar a los compradores a brindarle
            exactamente lo que necesita para comenzar a trabajar en su pedido.
          </p>
          {/* <Draggable> */}
          {questions.map((question, i) => questionComponent(question, i))}
          {/* </Draggable> */}
          <div className="control mt-6 has-text-centered">
            <input
              type="button"
              className="button is-link"
              // style={{ width: "100%" }}
              value="Agregar campo"
              onClick={() => addQuestion()}
            />
          </div>

          <div className="control mt-6 has-text-centered">
            <input
              type={"submit"}
              className="button is-success"
              style={{ width: "80%" }}
              value="Guardar y continuar"
            />
          </div>

          {/* <button onClick={() => setActiveIndex(1)}>Next</button> */}
        </form>
      </SectionContent>
    </>
  );
};

export default NewServiceDescription;
