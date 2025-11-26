import React, { useState, useEffect } from "react";
import { Chart } from "primereact/chart";
import axios from "axios";
import { ProjectApi } from "../../../api";
import { Avatar } from "primereact/avatar";
import { getURLImage } from "../../../utils/images";

export const ActiveClients = ({ freelancerId }) => {
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
        <p className="mt-2 mb-4 ml-4 has-text-left">Clientes activos</p>
        {projectsDataGrouped &&
          projectsDataGrouped.map((p, i) => {
            return (
              <div key={i} className="columns is-vcentered">
                <div className="column is-2">
                  <Avatar
                    className="ml-3 mt-2"
                    image={getURLImage(p.data.freelancer?.photo)}
                    size="large"
                    shape="circle"
                  />
                </div>
                <div className="column has-text-left">
                  <p className="description-total">{p.data.freelancer.name}</p>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};
