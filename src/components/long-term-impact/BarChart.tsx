'use client';

import { Bar } from 'react-chartjs-2';
import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BarChartProps {
  title: string;
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string | string[];
  }[];
  caption?: string;
  yAxisLabel?: string;
}

export default function BarChart({ title, labels, datasets, caption, yAxisLabel }: BarChartProps) {
  const [barWidth, setBarWidth] = useState(80);
  
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 250 && width <= 549) {
        setBarWidth(20); // Narrower bars for small screens
      } else if (width >= 550 && width <= 1024) { 
        setBarWidth(50);
      }
      else {
        setBarWidth(80); // Default bar width for larger screens
      }
      // if (width >= 550 && width <= 1023) {
      //   setBarWidth(20); // Narrower bars for small screens
      // } else {
      //   setBarWidth(80); // Default bar width for larger screens
      // }
    };

    // Set initial width
    handleResize();

    // Add resize listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isOverviewChart = title.includes("Monthly Distribution");
  const isDemographicChart = title.includes("Demographic");
  
  const chartData = {
    labels,
    datasets: datasets.map(dataset => ({
      ...dataset,
      barThickness: isOverviewChart ? 24 : barWidth,
      borderRadius: 4,
      categoryPercentage: isDemographicChart ? 0.8 : 0.9,
      barPercentage: isDemographicChart ? 0.9 : 1.0,
    })),
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: datasets.length > 1,
        position: 'top' as const,
        align: 'start' as const,
        labels: {
          padding: 20,
          font: {
            family: 'var(--font-geist-sans)',
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.parsed.y}%`,
        },
      },
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
            family: 'var(--font-geist-sans)',
            size: 10,
          },
          maxRotation: 45,
          minRotation: 45,
          padding: 8,
          autoSkip: false,
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        border: {
          display: false,
        },
        title: {
          display: !!yAxisLabel,
          text: yAxisLabel,
          font: {
            family: 'var(--font-geist-sans)',
            size: 12,
          },
          color: '#6B7280',
        },
        ticks: {
          font: {
            family: 'var(--font-geist-sans)',
            size: 11,
          },
          callback: (value) => `${value}%`,
          padding: 8,
        },
      },
    },
  };

  return (
    <div className={`rounded-2xl p-3 sm:p-4 md:p-6 border ${isOverviewChart ? 'bg-white' : 'bg-[#f6ffff]'}`}>
      <div className="text-xs sm:text-sm text-gray-500">Metrics</div>
      <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 md:mb-6 break-words">
        {title}
      </h3>
      <div className="h-[300px] sm:h-[350px] md:h-[400px] w-full">
        <Bar data={chartData} options={options} />
      </div>
      {caption && (
        <div className="mt-3 sm:mt-4 space-y-1 sm:space-y-2">
          <div className="flex items-start gap-2">
            {title.includes("Demographic") ? (
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-red-500 mt-1.5" />
            ) : (
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 mt-1.5" />
            )}
            <p className="text-xs sm:text-sm text-gray-700 font-medium">{caption}</p>
          </div>
          {title.includes("Regional") && (
            <p className="text-xs sm:text-sm text-gray-600 ml-3 sm:ml-4">
              Atlantic Provinces show the lowest participation, indicating need for targeted interventions
            </p>
          )}
          {title.includes("Demographic") && (
            <p className="text-xs sm:text-sm text-gray-600 ml-3 sm:ml-4">
              Focus areas: Indigenous Communities, Rural Areas, Low-Income Regions
            </p>
          )}
        </div>
      )}
    </div>
  );
} 