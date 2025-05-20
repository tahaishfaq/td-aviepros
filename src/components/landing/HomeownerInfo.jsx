import home from "../../assets/landingicons/home.jpg";
import visitor from "../../assets/landingicons/visitor.png";
import guest from "../../assets/landingicons/guest.png";
import alert from "../../assets/landingicons/alert.png";
import report from "../../assets/landingicons/report.png";

const features = [
  {
    icon: visitor,
    title: "Day visitor",
    description:
      "Quickly call in a guest for same day visits—no hassle, no delays.",
  },
  {
    icon: guest,
    title: "Add guest",
    description:
      "Maintain a secure list for trusted individuals like, friends, and relatives",
  },
  {
    icon: alert,
    title: "Vacation Alert",
    description:
      "Heading out of town? Let security know with a vacation alert for added peace of mind.",
  },
  {
    icon: report,
    title: "Incident Report",
    description:
      "Report incidents directly to the security team for fast action and better oversight.",
  },
];

export default function HomeownerInfo() {
  return (
    <div className="max-w-7xl mx-auto py-20 sm:px-0 px-4">
      <div className="bg-white flex items-center justify-center flex-col gap-y-10">
        <div className="flex flex-col items-center justify-center gap-y-3">
          <img src={home} alt="home" className="size-12 object-cover" />
          <div className="text-center space-y-3">
            <h1 className="text-4xl font-medium">Home Owner</h1>
            <p className="text-sm font-light max-w-xs">
              Enjoy full control over your property’s visitor access and
              security. Simple tools to keep your home safe and monitored at all
              times.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="px-5 py-3 border border-[#E9EAEB] rounded-lg flex flex-col items-center justify-center gap-y-5"
            >
              <img
                src={feature?.icon}
                alt="icon"
                className="size-10 object-cover"
              />
              <div className="text-center">
                <h3 className="font-medium text-xl">{feature?.title}</h3>
                <p className="text-sm font-light">{feature?.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
