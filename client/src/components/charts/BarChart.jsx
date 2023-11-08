import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';

export const BarChart = (props) => {
  const { labelSet, dataGathered, maxBarValue, labelTop } = props;
  const itemsPerPage = 5;

  const totalPages = Math.ceil(dataGathered.length / itemsPerPage);
  const [currentPage, setCurrentPage] = useState(1);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const slicedData = dataGathered.slice(startIndex, endIndex);
  const labels = labelSet.slice(startIndex, endIndex);
  const backgroundColors = [];
  const borderColors = [];

  slicedData.forEach((value) => {
    if (value >= 90) {
      backgroundColors.push("#4D5F6E"); // Dark blue color
      borderColors.push("#4D5F6E"); // Dark blue color
    } else {
      backgroundColors.push("#D9E1E7"); // Gray color
      borderColors.push("#4D5F6E"); // Gray color
    }
  });

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const paginationButtons = totalPages > 1 ? (
    <div className='flex items-center justify-center gap-4'>
      <button className='px-5 py-2 mbg-200 mcolor-800 border-medium-800 rounded-[5px] font-medium' onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Back</button>
      <button className='px-5 py-2 mbg-200 mcolor-800 border-medium-800 rounded-[5px] font-medium' onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
    </div>
  ) : null;
  
  

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Overall Score Performance',
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 2,
        data: slicedData,
      },
    ],
  };

  const legendOptions = {
    display: true,
    position: 'top',
    labels: {
      usePointStyle: true,
      generateLabels: function (chart) {
        const legendItems = [];
        if (dataGathered.some(value => value >= 90)) {
          legendItems.push({
            text: `Greater than ${90}`,
            fillStyle: '#4D5F6E', // Dark blue color
            hidden: false,
          });
        }
        if (dataGathered.some(value => value < 90)) {
          legendItems.push({
            text: `Less than ${90}`,
            fillStyle: '#D9E1E7', // Light blue color
            hidden: false,
          });
        }
        return legendItems;
      },
    },
  };
  
  

  const options = {
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: maxBarValue,
      },
    },
    plugins: {
      legend: {
        display: false, 
      },
      title: {
        display: true,
        text: 'Overall Score Performance', 
        padding: {
          top: 10,
          bottom: 20,
        },
        font: {
          size: 16,
          weight: 'bold',
        },
      },
    },
    tooltips: {
      enabled: false,
    },
    hover: {
      mode: null,
    },
  };

  return (
    <div className='max-h-[45vh]' >
      <Bar className='h-[45vh]' data={data} options={{ ...options, plugins: { legend: legendOptions } }} />
      {paginationButtons}
    </div>
  );
};
