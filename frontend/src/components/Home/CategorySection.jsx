import { Link } from "react-router";
import Container from "../Shared/Container";

const categories = [
  {
    name: "Pothole",
    emoji: "🕳️",
    color: "bg-yellow-50 border-yellow-200 text-yellow-700",
  },
  {
    name: "Streetlight",
    emoji: "💡",
    color: "bg-blue-50 border-blue-200 text-blue-700",
  },
  {
    name: "Water Leakage",
    emoji: "💧",
    color: "bg-cyan-50 border-cyan-200 text-cyan-700",
  },
  {
    name: "Garbage Overflow",
    emoji: "🗑️",
    color: "bg-green-50 border-green-200 text-green-700",
  },
  {
    name: "Damaged Footpath",
    emoji: "🚶",
    color: "bg-orange-50 border-orange-200 text-orange-700",
  },
  {
    name: "Other",
    emoji: "📋",
    color: "bg-gray-50 border-gray-200 text-gray-700",
  },
];

const CategorySection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <Container>
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-gray-800">
            Browse by Category
          </h2>
          <p className="text-gray-500 mt-2">
            Find and filter issues by the type of infrastructure problem
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/all-issues?category=${cat.name}`}
              className={`flex flex-col items-center gap-2 p-5 rounded-2xl border
                hover:shadow-md transition cursor-pointer ${cat.color}`}
            >
              <span className="text-4xl">{cat.emoji}</span>
              <span className="text-sm font-semibold text-center">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default CategorySection;
