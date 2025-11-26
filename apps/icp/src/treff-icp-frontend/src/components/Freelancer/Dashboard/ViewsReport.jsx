import React from 'react';
import { Chart } from 'primereact/chart';

const ViewsReport = ({ data }) => {
  const chartData = {
    labels: ['Proyectos activos', 'Visitas a proyectos'],
    datasets: [
      {
        label: 'Total de proyectos y visitas',
        data: [data.projects, data.views],
        backgroundColor: ['#007ad9', '#34bfa3'],
      },
    ],
  };

  return (
    <div>
      <Chart type="bar" data={chartData} />
    </div>
  );
};

export default ViewsReport;
