'use client';

import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Plugin
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface MonthlyEngagement {
  month: string;
  count: number;
}

// Custom grid line plugin
const dashedGrid: Plugin = {
  id: 'dashedGrid',
  beforeDatasetsDraw: (chart) => {
    const { ctx, chartArea, scales } = chart;
    if (!chartArea) return;

    const yScale = scales.y;
    if (!yScale) return;

    const yPixels = yScale.ticks.map((_, i) => yScale.getPixelForTick(i));
    
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);

    yPixels.forEach(pixel => {
      ctx.moveTo(chartArea.left, pixel);
      ctx.lineTo(chartArea.right, pixel);
    });

    ctx.stroke();
    ctx.restore();
  }
};

// Register the custom plugin
ChartJS.register(dashedGrid);

export default function ProgramEngagement() {
  const [engagementData, setEngagementData] = useState<MonthlyEngagement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEngagementData();
  }, []);

  const fetchEngagementData = async () => {
    try {
      const response = await fetch('/api/program-engagement');
      const data = await response.json();
      setEngagementData(data);
    } catch (error) {
      console.error('Error fetching engagement data:', error);
    } finally {
      setLoading(false);
    }
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
        ticks: {
          font: {
            weight: 600
          },
          color: '#000000'
        }
      },
      y: {
        min: 0,
        max: 2500,
        ticks: {
          stepSize: 500,
          font: {
            weight: 600
          },
          color: '#000000'
        },
        grid: {
          display: true,
          drawBorder: false,
          drawOnChartArea: false  // We'll draw our own grid with the plugin
        },
        border: {
          display: false
        }
      }
    },
    interaction: {
      intersect: false,
    },
  } as const;

  if (loading) {
    return <div>Loading chart...</div>;
  }

  return (
    <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl shadow-sm">
      <div className="flex flex-col mb-4 sm:mb-6">
        <h3 className="text-lg sm:text-xl font-semibold text-black">Program Engagement Trends</h3>
        <div className="text-green-500 text-xs sm:text-sm mt-1">(+100) more in 2024</div>
      </div>
      <div className="h-[250px] sm:h-[300px]">
        <Line 
          data={{
            labels: engagementData.map(item => item.month),
            datasets: [
              {
                label: 'Program Engagement',
                data: engagementData.map(item => item.count),
                borderColor: '#1B7DDA',
                backgroundColor: 'rgba(27, 125, 218, 0.1)',
                tension: 0.4,
                fill: true,
                pointStyle: 'circle' as const,
                pointRadius: 0,
                borderWidth: 2,
              }
            ]
          }}
          options={options}
        />
      </div>
    </div>
  );
} 