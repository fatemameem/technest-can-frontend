import Header from "@/components/Header";

// import Sidebar from "@/components/Sidebar";

export default function AboutUs() {
  return (
    <>
      <div className="flex flex-col w-full min-h-screen">
        <Header/>
        <div className="flex-1 flex justify-start w-full items-start">
          <main className=" shadow-sm overflow-y-auto p-8 max-h-[86vh] py-10 px-12 bg-white border rounded-3xl">
            <h1 className="text-3xl font-bold text-blue-800 mb-6">About TechNest Canada</h1>
            
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Mission</h2>
              <p className="text-gray-700 mb-4">
                TechNest Canada fosters innovation and education in STEM fields across Canada, 
                connecting students, educators, and professionals to build a stronger future through 
                science, technology, engineering, and mathematics.
              </p>
              <p className="text-gray-700">
                We believe that accessible STEM education is the foundation for innovation and economic growth,
                creating pathways for Canadian youth to develop critical skills for the challenges of tomorrow.
              </p>
            </section>
            
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">What We Do</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-xl font-medium text-blue-700 mb-3">STEM Programs</h3>
                  <p className="text-gray-700">
                    We coordinate and support innovative STEM programs nationwide, from engineering competitions 
                    to mathematics workshops, science camps, and technology conferences.
                  </p>
                </div>
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="text-xl font-medium text-green-700 mb-3">Scholarships & Grants</h3>
                  <p className="text-gray-700">
                    We provide financial support to promising students and impactful educational initiatives 
                    through our scholarships and grants programs.
                  </p>
                </div>
                <div className="bg-purple-50 p-6 rounded-lg">
                  <h3 className="text-xl font-medium text-purple-700 mb-3">Research & Development</h3>
                  <p className="text-gray-700">
                    We partner with academic institutions to advance research and development in key STEM 
                    fields, creating new opportunities for innovation and discovery.
                  </p>
                </div>
                <div className="bg-orange-50 p-6 rounded-lg">
                  <h3 className="text-xl font-medium text-orange-700 mb-3">Community Building</h3>
                  <p className="text-gray-700">
                    We connect STEM professionals, educators, and students across Canada, building a 
                    collaborative community that shares knowledge and resources.
                  </p>
                </div>
              </div>
            </section>
            
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Impact</h2>
              <p className="text-gray-700 mb-4">
                Since our founding, TechNest Canada has:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Supported over 100 STEM programs across all Canadian provinces and territories</li>
                <li>Provided educational opportunities to thousands of students from diverse backgrounds</li>
                <li>Built partnerships with leading universities and research institutions nationwide</li>
                <li>Facilitated groundbreaking research in emerging technologies and scientific fields</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Join Us</h2>
              <p className="text-gray-700 mb-4">
                Whether you&apos;re a student, educator, professional, or simply passionate about STEM, 
                there are many ways to get involved with TechNest Canada:
              </p>
              <div className="bg-blue-100 p-6 rounded-lg">
                <p className="text-gray-800 mb-3">
                  Connect with us through our programs, apply for scholarships, volunteer your time and expertise, 
                  or partner with us to create new STEM initiatives in your community.
                </p>
                <button className="bg-blue-700 hover:bg-blue-800 text-white py-2 px-6 rounded-md font-medium transition duration-200">
                  Contact Us
                </button>
              </div>
            </section>
          </main>
        </div>
      </div>
    </>
  );
}
