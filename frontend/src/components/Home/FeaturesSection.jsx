import {
  MdOutlineReportProblem,
  MdOutlineTrackChanges,
  MdOutlineVerifiedUser,
  MdOutlineNotificationsActive,
  MdOutlineSpeed,
  MdOutlineLock,
} from "react-icons/md";
import { BsLightningChargeFill } from "react-icons/bs";
import Container from "../Shared/Container";

const features = [
  {
    icon: MdOutlineReportProblem,
    color: "bg-blue-100 text-blue-600",
    title: "Easy Reporting",
    desc: "Submit issues with photos, location, and category in just a few taps from any device.",
  },
  {
    icon: MdOutlineTrackChanges,
    color: "bg-green-100 text-green-600",
    title: "Real-Time Tracking",
    desc: "Follow your issue through every stage — from submission to resolution with a live timeline.",
  },
  {
    icon: MdOutlineVerifiedUser,
    color: "bg-purple-100 text-purple-600",
    title: "Role-Based Access",
    desc: "Citizens, staff, and admins each have dedicated dashboards tailored to their responsibilities.",
  },
  {
    icon: BsLightningChargeFill,
    color: "bg-orange-100 text-orange-500",
    title: "Boost Priority",
    desc: "Pay a small fee to boost your issue to high priority and get faster attention from staff.",
  },
  {
    icon: MdOutlineNotificationsActive,
    color: "bg-yellow-100 text-yellow-600",
    title: "Status Updates",
    desc: "Stay informed as your issue progresses through pending, in-progress, resolved, and closed stages.",
  },
  {
    icon: MdOutlineLock,
    color: "bg-red-100 text-red-500",
    title: "Secure & Transparent",
    desc: "Every action is logged in an immutable timeline for full accountability and transparency.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-16 bg-white">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-800">
            Why CivicFix?
          </h2>
          <p className="text-gray-500 mt-2 max-w-xl mx-auto">
            A smarter, faster way for citizens and municipal teams to
            collaborate on fixing public infrastructure.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f) => (
            <div
              key={f.title}
              className="flex gap-4 p-6 rounded-2xl border border-gray-100
                hover:shadow-md transition bg-gray-50 group"
            >
              <div
                className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-xl ${f.color}`}
              >
                <f.icon className="text-2xl" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-1">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default FeaturesSection;
