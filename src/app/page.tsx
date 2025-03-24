import Header from "@/components/Header";
import Overview from "@/components/Overview";
import ProgramEngagement from "@/components/ProgramEngagement";
import RecentPrograms from "@/components/RecentPrograms";
// import KeyMetrics from "@/components/KeyMetrics";
// import Sidebar from "@/components/Sidebar";

export default function Home() {
  return (
    <div className="flex flex-col gap-2 lg:gap-3 xl:gap-4">
      <Header />
      {/* Overview Section - Full Width */}
      <div className="w-full">
        <Overview />
      </div>

      {/* Responsive Column Layout - Single column on mobile, two columns on larger screens */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-3 xl:gap-4">
        {/* Program Engagement */}
        <div>
          <ProgramEngagement />
        </div>

        {/* Recent Programs */}
        <div>
          <RecentPrograms />
        </div>
      </div>
    </div>
  );
}
