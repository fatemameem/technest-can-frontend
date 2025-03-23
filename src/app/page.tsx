import Header from "@/components/Header";
import Overview from "@/components/Overview";
import ProgramEngagement from "@/components/ProgramEngagement";
import RecentPrograms from "@/components/RecentPrograms";
// import KeyMetrics from "@/components/KeyMetrics";
// import Sidebar from "@/components/Sidebar";

export default function Home() {
  return (
    <div className="flex flex-col gap-7">
      <Header />
      {/* Overview Section - Full Width */}
      <div className="w-full">
        <Overview />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-2 gap-7">
        {/* Left Column - Program Engagement */}
        <div>
          <ProgramEngagement />
        </div>

        {/* Right Column - Recent Programs */}
        <div>
          <RecentPrograms />
        </div>
      </div>
    </div>
  );
}
