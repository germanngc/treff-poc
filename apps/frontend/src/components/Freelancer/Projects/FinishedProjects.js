import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ProjectApi } from "../../../api";
import { statusData } from "../../../utils/status";
import ProjectListByStatus from "./ProjectListByStatus";

const FinishedProjects = (props) => {
  const user = useSelector((state) => state.user.value);
  const freelancerId = user.id;
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const getProjects = async () => {
      const servs = await ProjectApi.getProjectsByFreelancerId(
        freelancerId,
        statusData.FINISHED.value
      );
      setProjects(servs);
    };
    if (freelancerId) {
      getProjects();
    }
  }, [freelancerId]);
  return (
    <>
      <div className="pb-6 mt-5">
        <div className="has-text-centered mb-4 is-hidden-widescreen">
          <p className="p-18-dark">
            <b>Proyectos completados</b>
          </p>
        </div>
          <ProjectListByStatus projects={projects} />
      </div>
    </>
  );
};

export default FinishedProjects;
