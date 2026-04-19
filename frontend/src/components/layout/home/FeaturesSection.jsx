import { FaBell, FaClipboardList, FaTools } from "react-icons/fa";

function FeaturesSection() {
  return (
    <section className="bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-16 sm:px-6 md:grid-cols-3">
        <div className="rounded-3xl bg-[#F5F8FC] p-7">
          <FaClipboardList className="mb-4 text-3xl text-[#2F80ED]" />
          <h4 className="mb-3 text-xl font-bold text-[#123A7A]">
            Clear Workflows
          </h4>
          <p className="text-slate-600">
            Manage booking approvals and ticket progress through clean,
            understandable workflow states.
          </p>
        </div>

        <div className="rounded-3xl bg-[#F5F8FC] p-7">
          <FaTools className="mb-4 text-3xl text-[#2F80ED]" />
          <h4 className="mb-3 text-xl font-bold text-[#123A7A]">
            Maintenance Visibility
          </h4>
          <p className="text-slate-600">
            Report campus issues, assign technicians, and monitor resolution
            updates in one place.
          </p>
        </div>

        <div className="rounded-3xl bg-[#F5F8FC] p-7">
          <FaBell className="mb-4 text-3xl text-[#2F80ED]" />
          <h4 className="mb-3 text-xl font-bold text-[#123A7A]">
            Instant Updates
          </h4>
          <p className="text-slate-600">
            Stay informed with notification-driven activity for bookings,
            tickets, and comments.
          </p>
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;