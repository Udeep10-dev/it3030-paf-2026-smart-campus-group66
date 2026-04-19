import { Link } from "react-router-dom";
import {
  FaBell,
  FaCalendarCheck,
  FaTools,
  FaUniversity,
} from "react-icons/fa";

function QuickAccessSection() {
  const quickLinks = [
    {
      title: "Facilities & Assets",
      description: "Browse lecture halls, labs, meeting rooms, and equipment.",
      icon: <FaUniversity size={22} />,
      to: "/resources",
    },
    {
      title: "Booking Requests",
      description: "Make and manage resource booking requests easily.",
      icon: <FaCalendarCheck size={22} />,
      to: "/booking/new",
    },
    {
      title: "Incident Tickets",
      description: "Report faults, track progress, and manage maintenance issues.",
      icon: <FaTools size={22} />,
      to: "/tickets",
    },
    {
      title: "Notifications",
      description: "See booking updates, ticket comments, and status changes.",
      icon: <FaBell size={22} />,
      to: "/notifications",
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-[#2F80ED]">
          Quick Access
        </p>
        <h3 className="mt-2 text-3xl font-bold text-[#123A7A]">
          Core Campus Services
        </h3>
        <p className="mt-2 max-w-2xl text-slate-600">
          Quickly navigate to the main workflows of the system using the cards
          below.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {quickLinks.map((item) => (
          <Link
            key={item.title}
            to={item.to}
            className="group rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#4FD1C5] to-[#2F80ED] text-white shadow-md">
              {item.icon}
            </div>

            <h4 className="mb-2 text-xl font-bold text-[#123A7A] group-hover:text-[#2F80ED]">
              {item.title}
            </h4>
            <p className="text-sm leading-6 text-slate-600">
              {item.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default QuickAccessSection;