import KeyMetrics from "./KeyMetrics";

export default function Overview() {
  return (
    <>
      <div className="py-4 px-4 sm:py-6 sm:px-6 md:py-8 md:px-8 lg:py-10 lg:px-12 bg-white border rounded-xl sm:rounded-2xl lg:rounded-3xl">
        <h1 className="font-bold text-extrabold capitalize text-xl sm:text-2xl lg:text-3xl text-black mb-2">General Dashboard Overview</h1>
        <p className="text-sm sm:text-base lg:text-lg font-light text-black mt-2">The aim of the National STEM Awareness Dashboard is to fill the void in the landscape of Canada&apos;s participation and improvement in STEM by giving the relevant details and information about various STEM intervention programmes, the people who benefit from the programmes, and the geographical coverage.</p>
        <h1 className="font-bold text-extrabold capitalize text-xl sm:text-2xl lg:text-3xl text-black mb-2 mt-6 lg:mt-8">Key Metrics</h1>
        <KeyMetrics/>
      </div>
    </>
  );
}