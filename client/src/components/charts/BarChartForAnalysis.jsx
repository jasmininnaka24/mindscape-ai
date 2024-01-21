import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';


export const BarChartForAnalysis = (props) => {
  const { labelSet, dataGathered, maxBarValue } = props;

  const labels = labelSet;


  const backgroundColors = ["#E1ECEB", "#3D5654"];
  const borderColors = ["#3D5654", "#3D5654"];
  
  if (labels.length === 3) {
    backgroundColors.splice(1, 0, "#E1ECEB");
    borderColors.splice(1, 0, "#3D5654");
  }
  
  const data = {
    labels: labels,
    datasets: [
      {
        label: "Assessment Score Records",
        backgroundColor: [...backgroundColors],
        borderColor: [...borderColors],
        borderWidth: 1.5,
        data: dataGathered,
      },
    ],
  };
  
  
  const legendOptions = {
    display: true,
    labels: {
      boxWidth: 0, 
    },
  };
  
  const options = {
    maintainAspectRatio: false,
    animation: true,
    scales: {
      y: {
        beginAtZero: true,
        max: maxBarValue,
      },
    },
  };
  

  return (
    <div className='max-h-[45vh]' >
      <Bar className='h-[45vh]' data={data} options={{ ...options, plugins: { legend: legendOptions } }} />
    </div>
  );
};
