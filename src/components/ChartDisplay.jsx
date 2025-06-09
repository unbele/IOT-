import React, { useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';

const ChartDisplay = ({ id, labels, data, label, color }) => {
  const canvasRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.data.labels = labels;
      chartInstance.current.data.datasets[0].data = data;
      chartInstance.current.update();
    } else {
      const ctx = canvasRef.current.getContext('2d');
      chartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels,
          datasets: [{
            label,
            data,
            borderColor: color,
            borderWidth: 3,
            fill: false,
            pointRadius: 5,
            pointBackgroundColor: color,
            pointBorderColor: color
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { labels: { color: '#00ffcc' } }
          },
          scales: {
            x: {
              ticks: { color: '#00ffcc' },
              grid: { color: 'rgba(0,255,204,0.1)' }
            },
            y: {
              ticks: { color: '#00ffcc' },
              grid: { color: 'rgba(0,255,204,0.1)' }
            }
          }
        }
      });
    }
  }, [labels, data]);

  return <canvas ref={canvasRef} id={id} />;
};

export default ChartDisplay;