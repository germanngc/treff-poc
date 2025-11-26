import React from 'react';
import { Chart } from 'primereact/chart';
import { Card } from 'primereact/card';

const ProjectChart = ({ projects, status }) => {
  let filteredProjects;

  // Filtrar proyectos según el estado o mostrar todos
  if (status === 'all') {
    filteredProjects = projects;
  } else {
    filteredProjects = projects.filter(project => project.status === status);
  }

  // Obtener la propiedad de fecha correspondiente
  const dateProperty = status === 'all' ? 'creationDate' : (status === 4 ? 'finishDate' : 'creationDate');

  // Agrupar proyectos por mes
  const groupedProjects = filteredProjects.reduce((acc, project) => {
    const month = new Date(project[dateProperty]).getMonth();
    if (acc[month]) {
      acc[month]++;
    } else {
      acc[month] = 1;
    }
    return acc;
  }, []);

  // Llenar de ceros los meses sin proyectos
  const filledProjects = Array.from({ length: 12 }, (_, i) => groupedProjects[i] || 0);

  // Datos para la gráfica de barras y línea
  const chartData = {
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    datasets: [
      {
        type: 'bar',
        label: 'Proyectos',
        backgroundColor: '#007be5',
        data: groupedProjects,
        order: 2, // Orden de visualización de las barras (2 = debajo de las líneas)
      },
      {
        type: 'line',
        label: 'Línea',
        borderColor: '#ff0000',
        borderWidth: 2,
        fill: false,
        data: filledProjects,
        order: 1, // Orden de visualización de las líneas (1 = encima de las barras)
      },
    ],
  };

  const chartOptions = {
    scales: {
      x: { stacked: true },
      y: { stacked: true },
    },
  };

  // Obtener el título según el estado
  let title = '';
  switch (status) {
    case 'all':
      title = 'Gráfica de Inicio de los Proyectos';
      break;
    case 1:
      title = 'Gráfica de Proyectos Activos';
      break;
    case 2:
      title = 'Gráfica de Proyectos Cancelados por el Usuario';
      break;
    case 3:
      title = 'Gráfica de Proyectos Cancelados por el Freelancer';
      break;
    case 4:
      title = 'Gráfica de Proyectos Finalizados';
      break;
    default:
      title = 'Gráfica de Proyectos';
      break;
  }

  return (
    <Card title={title}>
      <div className="p-grid p-justify-center">
        <div className="p-col-10">
          <Chart type="bar" data={chartData} options={chartOptions} />
        </div>
      </div>
    </Card>
  );
};

export default ProjectChart;
