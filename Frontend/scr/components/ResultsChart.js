// frontend/src/components/ResultsChart.js
import React from 'react';
import { Bar } from 'react-chartjs-2';

export default function ResultsChart({ results }) {
  const data = {
    labels: ['Random Forest', 'KNN'],
    datasets: [
      {
        label: 'Attack Probability',
        data: [
          results.rf_probability[0] * 100,
          results.knn_probability[0] * 100
        ],
        backgroundColor: ['#FF6384', '#36A2EB'],
      }
    ]
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        max: 100
      }
    }
  };

  return <Bar data={data} options={options} />;
}