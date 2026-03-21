import Container from "../Shared/Container";

const steps = [
  {
    step: "01",
    color: "bg-blue-600",
    title: "Submit a Report",
    desc: "Citizens fill out a short form with the issue title, description, category, photo, and location. Logged-in users can submit instantly.",
  },
  {
    step: "02",
    color: "bg-indigo-600",
    title: "Admin Reviews & Assigns",
    desc: "The admin reviews incoming reports and assigns a qualified staff member based on issue type and location.",
  },
  {
    step: "03",
    color: "bg-purple-600",
    title: "Staff Takes Action",
    desc: "The assigned staff verifies the issue on-ground and begins work, updating the status from Pending → In Progress → Working.",
  },
  {
    step: "04",
    color: "bg-pink-600",
    title: "Issue Gets Resolved",
    desc: "Once the work is complete, the staff marks the issue as Resolved and then Closed. The full timeline is preserved.",
  },
  {
    step: "05",
    color: "bg-orange-500",
    title: "Citizens Track Progress",
    desc: "At every stage, citizens can view the live timeline and status updates for any issue they submitted or care about.",
  },
];

const HowItWorksSection = () => {
  return (
    <section className="py-16 bg-white">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-800">
            How It Works
          </h2>
          <p className="text-gray-500 mt-2 max-w-xl mx-auto">
            From citizen report to full resolution — a transparent, step-by-step
            process.
          </p>
        </div>

        <div className="relative">
          {/* Vertical connector line (desktop) */}
          <div
            className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5
            bg-gradient-to-b from-blue-200 to-orange-200 -translate-x-1/2"
          />

          <div className="space-y-10">
            {steps.map((s, i) => (
              <div
                key={s.step}
                className={`flex flex-col md:flex-row items-center gap-6 relative
                  ${i % 2 === 1 ? "md:flex-row-reverse" : ""}`}
              >
                {/* Card */}
                <div className="w-full md:w-5/12 bg-gray-50 rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <h3 className="font-bold text-gray-800 text-lg mb-2">
                    {s.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {s.desc}
                  </p>
                </div>

                {/* Step badge (center) */}
                <div className="flex-shrink-0 z-10">
                  <div
                    className={`w-12 h-12 ${s.color} text-white rounded-full flex items-center
                    justify-center font-extrabold text-lg shadow-md`}
                  >
                    {s.step}
                  </div>
                </div>

                {/* Empty half for alternate layout */}
                <div className="hidden md:block w-5/12" />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default HowItWorksSection;
