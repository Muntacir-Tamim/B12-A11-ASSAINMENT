import { Link } from "react-router";

const CTASection = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-700 to-indigo-700 text-white">
      <div className="max-w-screen-xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
          See a problem? Report it now.
        </h2>
        <p className="text-blue-200 text-lg max-w-xl mx-auto mb-8">
          Join thousands of citizens who are making their cities better — one
          report at a time.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/dashboard/report-issue"
            className="bg-yellow-400 text-gray-900 font-bold px-10 py-3 rounded-full
              hover:bg-yellow-300 transition shadow-md"
          >
            Report an Issue
          </Link>
          <Link
            to="/all-issues"
            className="bg-white/10 border border-white/30 text-white font-semibold px-10 py-3
              rounded-full hover:bg-white/20 transition"
          >
            Browse Issues
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
