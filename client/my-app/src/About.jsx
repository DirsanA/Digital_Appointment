import React, { useState } from "react";
// added comment in about page
const AboutUs = () => {
  const [activeTab, setActiveTab] = useState("mission");
  const [hoveredValue, setHoveredValue] = useState(null);

  return (
    <div className="relative bg-gradient-to-b from-blue-50 to-white">
      {/* Animated Header */}
      <div className="relative flex justify-center items-center bg-blue-900 h-96 overflow-hidden">
        <div className="absolute inset-0 bg-blue-800 opacity-90"></div>
        <div className="z-10 relative px-4 text-center">
          <h1 className="mb-6 font-bold text-white text-5xl md:text-7xl">
            <span className="inline-block animate-fadeIn">About</span>{" "}
            <span className="inline-block text-blue-300 animate-fadeIn delay-100">
              D²
            </span>{" "}
            <span className="inline-block animate-fadeIn delay-200">
              Hospital
            </span>
          </h1>
          <div className="bg-blue-400 mx-auto mb-8 w-24 h-1 animate-growWidth"></div>
          <p className="mx-auto max-w-2xl text-blue-100 text-xl animate-fadeIn delay-300">
            Redefining healthcare excellence through innovation and compassion
            since 1995
          </p>
        </div>
      </div>

      {/* Core Content */}
      <div className="mx-auto px-4 py-20 max-w-6xl">
        {/* Stats Grid */}
        <div className="gap-6 grid grid-cols-2 md:grid-cols-4 mb-20">
          {[
            { number: "25+", label: "Years of Excellence" },
            { number: "200+", label: "Specialist Doctors" },
            { number: "98%", label: "Patient Satisfaction" },
            { number: "50K+", label: "Patients Annually" },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-white shadow-sm hover:shadow-lg p-6 border border-blue-100 rounded-xl transition-all duration-300"
            >
              <div className="mb-2 font-bold text-blue-800 text-4xl animate-countUp">
                {stat.number}
              </div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tabbed Content */}
        <div className="mb-20">
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {[
              { id: "mission", label: "Our Mission" },
              { id: "values", label: "Core Values" },
              { id: "history", label: "Our Journey" },
              { id: "facilities", label: "Our Facilities" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 font-medium rounded-full transition-all ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-blue-600 hover:bg-blue-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="min-h-[400px]">
            {activeTab === "mission" && (
              <div className="space-y-8">
                <div className="bg-white shadow-sm p-8 border border-blue-50 rounded-2xl">
                  <h3 className="mb-6 font-bold text-gray-800 text-3xl">
                    Our Commitment to Healthcare Excellence
                  </h3>
                  <p className="mb-6 text-gray-600 text-lg leading-relaxed">
                    At D² Hospital, we combine cutting-edge medical technology
                    with compassionate care to deliver exceptional healthcare
                    services. Our team of specialists across 30 departments is
                    committed to your well-being through every stage of life.
                  </p>
                  <div className="gap-8 grid md:grid-cols-2">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-blue-700 text-xl">
                        <span className="inline-block bg-blue-100 mr-2 rounded-full w-6 h-6 text-blue-700 text-center">
                          ✓
                        </span>
                        Clinical Excellence
                      </h4>
                      <p className="text-gray-600">
                        Board-certified physicians utilizing evidence-based
                        medicine and the latest treatment protocols.
                      </p>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-semibold text-blue-700 text-xl">
                        <span className="inline-block bg-blue-100 mr-2 rounded-full w-6 h-6 text-blue-700 text-center">
                          ✓
                        </span>
                        Patient-Centered Care
                      </h4>
                      <p className="text-gray-600">
                        Personalized treatment plans tailored to each patient's
                        unique needs and circumstances.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "values" && (
              <div className="gap-6 grid md:grid-cols-3">
                {[
                  {
                    title: "Compassion",
                    description:
                      "Treating every patient with empathy, dignity and kindness in all interactions.",
                    color: "from-blue-100 to-blue-50",
                  },
                  {
                    title: "Innovation",
                    description:
                      "Embracing cutting-edge technologies and treatment methodologies to improve outcomes.",
                    color: "from-purple-100 to-purple-50",
                  },
                  {
                    title: "Integrity",
                    description:
                      "Maintaining the highest ethical standards in all our decisions and actions.",
                    color: "from-teal-100 to-teal-50",
                  },
                  {
                    title: "Excellence",
                    description:
                      "Striving for the highest quality in patient care, service and clinical outcomes.",
                    color: "from-indigo-100 to-indigo-50",
                  },
                  {
                    title: "Collaboration",
                    description:
                      "Working together across disciplines to provide comprehensive, coordinated care.",
                    color: "from-cyan-100 to-cyan-50",
                  },
                  {
                    title: "Community",
                    description:
                      "Serving and improving the health of our local and global communities.",
                    color: "from-sky-100 to-sky-50",
                  },
                ].map((value, index) => (
                  <div
                    key={index}
                    className={`bg-gradient-to-br ${value.color} p-6 rounded-xl border border-gray-100 hover:shadow-md transition-all duration-300 h-full`}
                    onMouseEnter={() => setHoveredValue(index)}
                    onMouseLeave={() => setHoveredValue(null)}
                  >
                    <h4 className="relative mb-4 font-bold text-gray-800 text-2xl">
                      <span
                        className={`absolute -left-2 w-1 h-8 bg-blue-600 rounded-full transition-all duration-300 ${
                          hoveredValue === index ? "opacity-100" : "opacity-0"
                        }`}
                      ></span>
                      {value.title}
                    </h4>
                    <p className="text-gray-600">{value.description}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Other tab content would go here */}
          </div>
        </div>

        {/* Accolades Section */}
        <div className="bg-blue-900 mb-20 p-8 md:p-12 rounded-2xl text-white">
          <h3 className="mb-8 font-bold text-3xl text-center">
            Recognized Excellence
          </h3>
          <div className="gap-8 grid md:grid-cols-3">
            {[
              {
                title: "JCI Accredited",
                description:
                  "Meeting international healthcare standards for quality and patient safety",
                icon: "🏆",
              },
              {
                title: "Top 100 Hospitals",
                description:
                  "Consistently ranked among the nation's best healthcare providers",
                icon: "⭐",
              },
              {
                title: "Patient Safety",
                description:
                  "Awarded for exceptional safety standards and infection control",
                icon: "🛡️",
              },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="mb-4 text-5xl">{item.icon}</div>
                <h4 className="mb-2 font-bold text-blue-200 text-xl">
                  {item.title}
                </h4>
                <p className="text-blue-100">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h3 className="mb-6 font-bold text-gray-800 text-3xl">
            Experience the D² Difference
          </h3>
          <p className="mx-auto mb-8 max-w-2xl text-gray-600 text-xl">
            Our doors are open to provide you with exceptional healthcare when
            you need it most.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="bg-blue-600 hover:bg-blue-700 shadow-lg px-8 py-3 rounded-full font-semibold text-white text-lg hover:scale-105 transition-all duration-300 transform">
              Meet Our Team
            </button>
            <button className="hover:bg-blue-50 px-8 py-3 border-2 border-blue-600 rounded-full font-semibold text-blue-600 text-lg hover:scale-105 transition-all duration-300 transform">
              Virtual Tour
            </button>
          </div>
        </div>
      </div>

      {/* Animated Divider */}
      <div className="relative bg-gradient-to-r from-blue-400 to-blue-600 h-1 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
      </div>
    </div>
  );
};

export default AboutUs;
// this is the comment
