import Image from 'next/image';

export default function KeyMetrics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 mb-6">
      {/* Active Programs Card */}
      <div className="bg-gradient-to-r from-[#1B7DDA] to-[#48A6FF] text-white p-6 rounded-[24px] flex justify-between items-center">
        <div>
          <h2 className="text-lg font-medium mb-2">Active Programs</h2>
          <p className="text-5xl font-bold">2,508</p>
        </div>
        <Image 
          src="/activeprograms.svg"
          alt="Active Programs"
          width={48}
          height={48}
          className="text-white"
        />
      </div>

      {/* Regions Covered Card */}
      <div className="bg-gradient-to-r from-[#1B7DDA] to-[#48A6FF] text-white p-6 rounded-[24px] flex justify-between items-center">
        <div>
          <h2 className="text-lg font-medium mb-2">Regions Covered</h2>
          <p className="text-5xl font-bold">10/13</p>
        </div>
        <Image 
          src="/regionscovered.svg"
          alt="Regions Covered"
          width={48}
          height={48}
          className="text-white"
        />
      </div>

      {/* STEM Graduates Card */}
      <div className="bg-gradient-to-r from-[#1B7DDA] to-[#48A6FF] text-white p-6 rounded-[24px] flex justify-between items-center">
        <div>
          <h2 className="text-lg font-medium mb-2">STEM Graduates</h2>
          <p className="text-5xl font-bold">22,139</p>
          <span className="text-sm">Per Year (2024)</span>
        </div>
        <Image 
          src="/stemgraduates.svg"
          alt="STEM Graduates"
          width={48}
          height={48}
          className="text-white"
        />
      </div>
    </div>
  );
} 