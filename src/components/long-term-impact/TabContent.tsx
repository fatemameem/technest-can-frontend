'use client';

import { TabData, TabType } from '@/types/long-term-impact';
import TrendChart from './TrendChart';
import BarChart from './BarChart';

interface TabContentProps {
  activeTab: TabType;
  data: TabData;
}

export default function TabContent({ activeTab, data }: TabContentProps) {
  if (!data) return null;

  switch (activeTab) {
    case 'overview':
      return data.overview ? (
        <div className="grid grid-cols-12 gap-3 sm:gap-4 md:gap-6">
          <div className="col-span-12 lg:col-span-7 space-y-3 sm:space-y-4 md:space-y-6">
            <TrendChart data={data.overview.trendData} />
            
            <div className="bg-gray-50 rounded-2xl p-4 sm:p-6">
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">Strategic Insights & Recommendations</h3>
              <ul className="space-y-2 sm:space-y-3">
                {data.overview.recommendations.map(rec => (
                  <li key={rec.id} className="flex items-start gap-2">
                    <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-blue-600 mt-2" />
                    <p className="text-sm sm:text-base text-gray-700">{rec.text}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-5 space-y-3 sm:space-y-4 md:space-y-6">
            <div>
              <BarChart
                title="Monthly Distribution of STEM Programs Added"
                labels={data.overview.monthlyDistribution.map(d => d.month)}
                datasets={[{
                  label: 'Programs',
                  data: data.overview.monthlyDistribution.map(d => d.count),
                  backgroundColor: '#F59E0B',
                }]}
              />
            </div>

            <div className="bg-gray-50 rounded-2xl p-4 sm:p-6">
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">General Reports</h3>
              <div className="space-y-2 sm:space-y-3">
                {data.overview.reports.map(report => (
                  <a
                    key={report.id}
                    href={report.link}
                    className="block text-sm sm:text-base text-gray-900 hover:text-blue-600 underline underline-offset-4"
                  >
                    {report.title}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null;

    case 'demographic':
    case 'regional':
      return (
        <div className="w-full px-2 sm:px-0">
          <BarChart
            title={activeTab === 'demographic' ? "Demographic Participation in STEM" : "Provincial STEM Participation Rates"}
            labels={activeTab === 'demographic' 
              ? data.demographic?.map(d => d.group) || []
              : data.regional?.map(d => d.province) || []
            }
            datasets={activeTab === 'demographic' 
              ? [
                  {
                    label: 'Current',
                    data: data.demographic?.map(d => d.currentValue) || [],
                    backgroundColor: '#7f87d9',
                  },
                  {
                    label: 'Target',
                    data: data.demographic?.map(d => d.targetValue) || [],
                    backgroundColor: '#76cc9d',
                  }
                ]
              : [{
                  label: 'Participation Rate',
                  data: data.regional?.map(d => d.participationRate) || [],
                  backgroundColor: '#7f87d9',
                }]
            }
            caption={activeTab === 'demographic'
              ? "Significant gaps in participation for underrepresented groups"
              : "Significant regional variations in STEM participation"
            }
            yAxisLabel={activeTab === 'demographic' ? "Participation %" : "STEM Participation"}
          />
        </div>
      );

    default:
      return null;
  }
} 