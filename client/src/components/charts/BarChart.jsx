import React from 'react'
import { Bar } from 'react-chartjs-2'
import Chart from "chart.js/auto";


export const BarChart = (props) => {

  const {labelSet, dataGathered, maxBarValue} = props;

  const labels = labelSet;

  const backgroundColors = ["#D9E1E7", "#4D5F6E"];
  const borderColors = ["#4D5F6E", "#4D5F6E"];
  
  if (labels.length === 3) {
    backgroundColors.splice(1, 0, "#D9E1E7");
    borderColors.splice(1, 0, "#4D5F6E");
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
    scales: {
      y: {
        beginAtZero: true,
        max: maxBarValue,
      },
    },
    plugins: {
      legend: {
        display: true,
        labels: {
          boxWidth: 0,
        },
      },
      tooltip: {
        enabled: false, 
      },
      hover: {
        mode: null, 
      },
    },
  };
  
  return (
    <div>
      <Bar data={data} options={{ ...options, plugins: { legend: legendOptions } }} />
    </div>  
  )
}
