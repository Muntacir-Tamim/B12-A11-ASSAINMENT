import { Link } from "react-router";
import { MdOutlineReportProblem, MdSearch } from "react-icons/md";
import { useState } from "react";
import { useNavigate } from "react-router";

const stats = [
  { label: "Issues Reported", value: "1,200+" },
  { label: "Issues Resolved", value: "980+" },
  { label: "Active Citizens", value: "4,500+" },
  { label: "Cities Covered", value: "12" },
];

const BannerSection = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`/all-issues?search=${query.trim()}`);
  };

  return (
    <section
      className="relative bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700
      text-white overflow-hidden"
    >
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-white opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-400 opacity-10 rounded-full translate-x-1/3 translate-y-1/3" />

      <div
        className="relative max-w-screen-xl mx-auto px-6 py-24 md:py-32 flex flex-col
        items-center text-center gap-8"
      >
        {/* Icon badge */}
        <div
          className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20
          px-4 py-2 rounded-full text-sm font-medium"
        >
          <MdOutlineReportProblem className="text-yellow-300 text-lg" />
          Public Infrastructure Issue Reporting System
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight max-w-3xl">
          Report. Track. <span className="text-yellow-300">Resolve.</span>
        </h1>

        <p className="text-blue-100 text-lg md:text-xl max-w-xl leading-relaxed">
          Help improve your city by reporting broken streetlights, potholes,
          water leakage, and other public infrastructure issues — right from
          your phone.
        </p>

        {/* Search bar */}
        <form
          onSubmit={handleSearch}
          className="w-full max-w-lg flex items-center bg-white rounded-full shadow-lg overflow-hidden"
        >
          <MdSearch className="text-gray-400 text-2xl ml-4 flex-shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search issues by title, category or location..."
            className="flex-1 px-4 py-3 text-gray-800 text-sm focus:outline-none"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 text-sm font-semibold
              hover:bg-blue-700 transition flex-shrink-0"
          >
            Search
          </button>
        </form>

        {/* CTA Buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/dashboard/report-issue"
            className="bg-yellow-400 text-gray-900 font-bold px-8 py-3 rounded-full
              hover:bg-yellow-300 transition shadow-md text-sm"
          >
            + Report an Issue
          </Link>
          <Link
            to="/all-issues"
            className="bg-white/10 border border-white/30 text-white font-semibold px-8 py-3
              rounded-full hover:bg-white/20 transition text-sm"
          >
            Browse All Issues
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6 w-full max-w-2xl">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center">
              <p className="text-3xl font-extrabold text-yellow-300">
                {s.value}
              </p>
              <p className="text-blue-200 text-xs mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BannerSection;
