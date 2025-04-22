'use client';

import { TrendData } from '@/types/long-term-impact';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  ChartOptions,
  ScriptableContext,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

interface TrendChartProps {
  data: TrendData[];
}

export default function TrendChart({ data }: TrendChartProps) {
  const chartData = {
    labels: data.map(d => d.year.toString()),
    datasets: [
      {
        fill: true,
        label: 'STEM Graduates',
        data: data.map(d => d.value),
        borderColor: '#7f87d9',
        backgroundColor: (context: ScriptableContext<'line'>) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 350);
          gradient.addColorStop(0, 'rgba(127, 135, 217, 0.3)');
          gradient.addColorStop(1, 'rgba(127, 135, 217, 0)');
          return gradient;
        },
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: '#7f87d9',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            family: 'var(--font-geist-sans)',
            size: 12,
          },
          color: '#9CA3AF',
        },
        border: {
          display: false,
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          font: {
            family: 'var(--font-geist-sans)',
            size: 12,
          },
          color: '#9CA3AF',
          callback: function(value) {
            if (typeof value === 'number' && value >= 1000) {
              return `${value/1000}k`;
            }
            return value;
          },
        },
        border: {
          display: false,
        }
      },
    },
  };

  return (
    <div className="bg-[#1E1B4B] rounded-2xl p-3 sm:p-4 md:p-6">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h3 className="text-lg sm:text-xl font-semibold text-white">STEM Graduates Trend (2016 - 2024)</h3>
        <div className="bg-white/10 rounded-lg p-1.5 sm:p-2">
          <svg 
            width="16"
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            className="text-white sm:w-5 sm:h-5"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M8 15v-6" />
            <path d="M12 15v-3" />
            <path d="M16 15v-9" />
          </svg>
        </div>
      </div>
      <div className="h-[250px] sm:h-[280px] md:h-[320px]">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
} 