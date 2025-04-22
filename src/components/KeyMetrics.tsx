import Image from 'next/image';

export default function KeyMetrics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 mb-4">
      {/* Active Programs Card */}
      <div className="bg-gradient-to-r from-[#1B7DDA] to-[#48A6FF] text-white p-4 rounded-[16px] flex justify-between items-center">
        <div>
          <h2 className="text-base font-medium mb-1">Active Programs</h2>
          <p className="text-4xl font-bold">2,508</p>
        </div>
        <div className="flex-shrink-0">
        <Image 
          src="/activeprograms.svg"
          alt="Active Programs"
            width={36}
            height={36}
        />
        </div>
      </div>

      {/* Regions Covered Card */}
      <div className="bg-gradient-to-r from-[#1B7DDA] to-[#48A6FF] text-white p-4 rounded-[16px] flex justify-between items-center">
        <div>
          <h2 className="text-base font-medium mb-1">Regions Covered</h2>
          <p className="text-4xl font-bold">10/13</p>
        </div>
        <div className="flex-shrink-0">
        <Image 
          src="/regionscovered.svg"
          alt="Regions Covered"
            width={36}
            height={36}
        />
        </div>
      </div>

      {/* STEM Graduates Card */}
      <div className="col-span-1 md:col-span-2 lg:col-span-1 bg-gradient-to-r from-[#1B7DDA] to-[#48A6FF] text-white p-4 rounded-[16px] flex justify-between items-center">
        <div>
          <h2 className="text-base font-medium mb-1">STEM Graduates</h2>
          <p className="text-4xl font-bold">22,139</p>
          <span className="text-sm">Per Year (2024)</span>
        </div>
        <div className="flex-shrink-0">
        <Image 
          src="/stemgraduates.svg"
          alt="STEM Graduates"
            width={36}
            height={36}
        />
        </div>
      </div>
    </div>
  );
} 