

const AboutUs = () => {
  return (
    <div className="bg-white pt-10 lg:pt-16 text-gray-800">

      {/* Hero Section */}
      <section className="relative bg-[#080546] text-white py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Test Series</h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto">
            Empowering students to achieve excellence through high-quality, structured mock tests.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          
          {/* Mission */}
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              At XYZ Test Series, our mission is to help learners prepare effectively for competitive exams by offering realistic, well-researched practice tests designed by experts.
            </p>
          </div>

          {/* Vision */}
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
            <p className="text-gray-600 leading-relaxed">
              To become the most trusted and comprehensive online test platform that enables students to unlock their full potential and succeed in their academic goals.
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Why Choose XYZ Test Series?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              "Curated Tests by Industry Experts",
              "Real Exam Simulation & Performance Analysis",
              "Instant Results & Detailed Reports",
              "Regular Updates Based on Latest Patterns"
            ].map((item, index) => (
              <div key={index} className="flex items-start space-x-3">
                <svg className="w-6 h-6 text-green-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <p className="text-gray-700">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values or Team Section */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Core Values</h2>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            {["Excellence", "Integrity", "Student-Centric Growth"].map((value, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-xl font-semibold text-gray-800">{value}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-[#080546] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-lg mb-6">
            Join thousands of successful students who trust XYZ Test Series for their preparation.
          </p>
          <a
            href="/signup"
            className="inline-block px-8 py-3 bg-white text-[#080546] font-semibold rounded-lg shadow hover:bg-gray-100 transition"
          >
            Get Started Today
          </a>
        </div>
      </section>

    </div>
  );
};

export default AboutUs;