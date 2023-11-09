import React from 'react';
import Chart from 'chart.js/auto';
import { Pie } from 'react-chartjs-2';

export const PieChart = ({ dataGathered }) => {
  const backgroundColors = ['#D9E1E7', '#4D5F6E'];
  const labels = ['Unpreparedness', 'Preparedness'];

  const data = {
    datasets: [
      {
        backgroundColor: backgroundColors,
        borderColor: '#4D5F6E',
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
          strokeStyle: '#4D5F6E',
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
