import React, { useState, useEffect } from "react";
import { Chart } from "primereact/chart";
import axios from "axios";
import { ProjectApi } from "../../../api";

export const PieChartFreelancer = ({ freelancerId }) => {
  const [projectsData, setProjectsData] = useState(null);
  const [projectsDataGrouped, setProjectsDataGrouped] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const response = await ProjectApi.getProjectsGroupedByUserId(
        freelancerId
      );
      setProjectsData(response);
      setProjectsDataGrouped(groupBy(response));
    }
    fetchData();
  }, [freelancerId]);

  const groupBy = (array, key) => {
    // Return the end result
    const result = array.reduce((acc, curr) => {
      if (!acc[curr[key]]) {
        acc[curr[key]] = { userId: curr[key], count: 1, data: curr };
      } else {
        acc[curr[key]].count++;
      }
      return acc;
    }, {});
    const groupedData = Object.values(result);
    return groupedData;
  };

  const chartData = {
    labels: projectsDataGrouped
      ? projectsDataGrouped.map((p) => {
          return p.data.freelancer.name;
        })
      : [],
    datasets: [
      {
        data: projectsData ? projectsDataGrouped.map((p) => p.count) : null,
        // data: projectsData?.map((p) => p.name) || [],
        // data: projectsData.map(
        //     (user) =>
        //       studentsTotal.filter((student) => student.course === user.id).length,
        backgroundColor: [
          "#42A5F5",
          "#66BB6A",
          "#FFA726",
          "#FF6384",
          "#4BC0C0",
        ],
        hoverBackgroundColor: [
          "#64B5F6",
          "#81C784",
          "#FFB74D",
          "#FF6384",
          "#4DD0E1",
        ],
      },
    ],
  };

  return (
    <div className="card">
      <div className="card-content">
        <p>Proyectos contratados por usuario</p>
        {projectsData && (
          <Chart
            type="polarArea"
            data={chartData}
            style={{ width: "400px", height: "400px", margin: "0px" }}
          />
        )}
      </div>
    </div>
  );
};
