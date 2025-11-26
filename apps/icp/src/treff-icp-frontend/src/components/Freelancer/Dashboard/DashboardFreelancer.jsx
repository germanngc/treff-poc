import { useState, useEffect } from "react";
import { PieChartFreelancer } from "./PieChartFreelancer";
import { useSelector } from "react-redux";
import { ActiveClients } from "./ActiveClients";
import ProjectChart from "./ProjectChart ";
import { ProjectApi } from "../../../api";
import ViewsReport from "./ViewsReport";

const DashboardFreelancer = () => {
  const userRedux = useSelector((state) => state.user.value);
  const [projectsData, setProjectsData] = useState(null);
  const [viewsData, setViewsData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const response = await ProjectApi.getProjectsGroupedByUserId(
        userRedux.id
      );
      setProjectsData(response);

      const response1 = await ProjectApi.getProjectViewsGroupedByUserId(
        userRedux.id
      );
      setViewsData(response1);
      // setProjectsDataGrouped(groupBy(response));
    }
    fetchData();
  }, [userRedux.id]);

  // useEffect(() => {
  //   async function fetchData() {
      
  //     // setProjectsDataGrouped(groupBy(response));
  //   }
  //   fetchData();
  // }, [userRedux.id]);

  return (
    <div className="columns">
      <div className="column">
        <div className="columns is-12">
          <div className="column">
            {/* <PieChartFreelancer freelancerId={userRedux.id} /> */}
            {projectsData && (
              <ProjectChart projects={projectsData} status={"all"} />
            )}
          </div>
          <div className="column">
            {/* <ActiveClients freelancerId={userRedux.id} /> */}
            {viewsData && <ViewsReport data={viewsData} />}
          </div>
          {/* <div className="column"></div> */}
        </div>
        <div className="columns is-12">
          <div className="column">
            {/* <PieChartFreelancer freelancerId={userRedux.id} /> */}
            {projectsData && (
              <ProjectChart projects={projectsData} status={1} />
            )}
          </div>
          <div className="column">
            {projectsData && (
              <ProjectChart projects={projectsData} status={2} />
            )}
          </div>
          {/* <div className="column"></div> */}
        </div>
        <div className="columns is-12">
          <div className="column">
            {/* <PieChartFreelancer freelancerId={userRedux.id} /> */}
            {projectsData && (
              <ProjectChart projects={projectsData} status={3} />
            )}
          </div>
          <div className="column">
            {projectsData && (
              <ProjectChart projects={projectsData} status={4} />
            )}
          </div>
          {/* <div className="column"></div> */}
        </div>
      </div>

      {/* <div className="column is-4">
        <ActiveClients freelancerId={userRedux.id} />
      </div> */}
    </div>
  );
};

export default DashboardFreelancer;
