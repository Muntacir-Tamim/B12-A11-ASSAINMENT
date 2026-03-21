import { MdOutlineReportProblem } from "react-icons/md";

const team = [
  { name: "Md. Rafiq Ahmed", role: "Project Lead", emoji: "👨‍💼" },
  { name: "Sumaiya Akter", role: "Backend Developer", emoji: "👩‍💻" },
  { name: "Tanvir Hossain", role: "Frontend Developer", emoji: "👨‍🎨" },
  { name: "Nadia Islam", role: "UI/UX Designer", emoji: "👩‍🎨" },
];

const About = () => {
  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white py-20 text-center px-6">
        <div className="flex justify-center mb-4">
          <MdOutlineReportProblem className="text-yellow-300 text-6xl" />
        </div>
        <h1 className="text-4xl font-extrabold">About CivicFix</h1>
        <p className="text-blue-200 mt-3 text-lg max-w-2xl mx-auto">
          CivicFix is a digital civic platform that bridges the gap between
          citizens and municipal authorities for faster, more transparent
          infrastructure issue resolution.
        </p>
      </div>

      {/* Mission */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-extrabold text-gray-800 mb-4">
            Our Mission
          </h2>
          <p className="text-gray-500 leading-relaxed">
            Municipal services often suffer from delayed response and lack of
            tracking. Citizens have no centralized platform to report problems.
            CivicFix solves this by providing a transparent, efficient, and
            data-driven way to manage public infrastructure issues — improving
            transparency, reducing response time, and making city service
            delivery more effective for everyone.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-extrabold text-gray-800 mb-8 text-center">
            Our Values
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                title: "Transparency",
                emoji: "🔍",
                desc: "Every action is logged and visible to all parties.",
              },
              {
                title: "Efficiency",
                emoji: "⚡",
                desc: "Fast response times through smart assignment and tracking.",
              },
              {
                title: "Accountability",
                emoji: "✅",
                desc: "Immutable timelines hold every stakeholder responsible.",
              },
            ].map((v) => (
              <div
                key={v.title}
                className="bg-white rounded-2xl p-6 text-center border border-gray-100 shadow-sm"
              >
                <p className="text-4xl mb-3">{v.emoji}</p>
                <h3 className="font-bold text-gray-800 mb-1">{v.title}</h3>
                <p className="text-gray-500 text-sm">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-extrabold text-gray-800 mb-8">
            Meet the Team
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {team.map((member) => (
              <div
                key={member.name}
                className="bg-gray-50 border border-gray-100 rounded-2xl p-6 shadow-sm"
              >
                <p className="text-5xl mb-3">{member.emoji}</p>
                <p className="font-bold text-gray-800 text-sm">{member.name}</p>
                <p className="text-gray-400 text-xs mt-1">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
