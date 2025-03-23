import KeyMetrics from "./KeyMetrics";

export default function Overview() {
  return (
    <>
      <div className="py-10 px-12 bg-white border rounded-3xl">
        <h1 className="font-bold text-extrabold capitalize text-3xl text-black mb-2">general dashboard overview</h1>
        <p className="text-lg font-light text-black mt-2">The aim of the National STEM Awareness Dashboard is to fill the void in the landscape of Canada’s participation and improvement in STEM by giving the relevant details and information about various STEM intervention programmes, the people who benefit from the programmes, and the geographical coverage.</p>
        <h1 className="font-bold text-extrabold capitalize text-3xl text-black mb-2 mt-8">key Metrics</h1>
        <KeyMetrics/>
      </div>
    </>
  );
}