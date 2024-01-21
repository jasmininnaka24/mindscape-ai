import React from 'react';
import Chart from 'chart.js/auto';
import { Pie } from 'react-chartjs-2';

export const PieChart = ({ dataGathered }) => {
  const backgroundColors = ['#E1ECEB', '#3D5654'];
  const labels = ['Unpreparedness', 'Preparedness'];

  const data = {
    datasets: [
      {
        backgroundColor: backgroundColors,
        borderColor: '#3D5654',
        data: dataGathered,
      },
    ],
  };

  const legendOptions = {
    display: true,
    position: 'top',
    labels: {
      usePointStyle: true,
      generateLabels: function (chart) {
        return labels.map((label, index) => ({
          text: label,
          fillStyle: backgroundColors[index],
          strokeStyle: '#3D5654',
          lineWidth: 2,
          hidden: false,
          index: index,
        }));
      },
    },
  };

  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: legendOptions,
      tooltip: {
        enabled: true,
        callbacks: {
          label: function (context) {
            const labelIndex = context.dataIndex;
            const dataValue = dataGathered[labelIndex];
            return ` Count: ${dataValue}`;
          },
        },
      },
      hover: {
        mode: null,
      },
    },
  };
  
  
  

  return (
    <Pie data={data} options={options} />
  );
};
