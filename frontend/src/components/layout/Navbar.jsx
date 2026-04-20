import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FaBars, FaHome, FaTimes } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const currentRole = user?.role?.toUpperCase?.() || "";
  const isAdmin = currentRole === "ADMIN";

  const navItems = [
    { label: "Home", to: "/" },
    {
      label: "Resources",
      to: currentRole === "STAFF" ? "/admin/resources" : "/resources",
    },
    { label: "Bookings", to: "/bookings/new" },
    { label: "Tickets", to: "/tickets" },
    { label: "Notifications", to: "/notifications" },
    ...(isAdmin ? [{ label: "Admin Panel", to: "/admin/notifications" }] : []),
  ];

  const navLinkClass = ({ isActive }) =>
    `transition hover:text-[#4FD1C5] ${
      isActive ? "text-white border-b-2 border-[#F5B400] pb-1" : "text-white"
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `block rounded-xl px-4 py-3 text-sm font-medium transition ${
      isActive
        ? "bg-[#3E4C59] text-white"
        : "text-slate-200 hover:bg-[#3E4C59] hover:text-white"
    }`;

  return (
    <>
      {/* Top header */}
      <header className="bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <Link to="/" className="flex items-center gap-3 sm:gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#4FD1C5] to-[#2F80ED] text-white shadow-md sm:h-14 sm:w-14">
              <FaHome size={20} />
            </div>

            <div>
              <h1 className="text-lg font-extrabold tracking-wide text-[#123A7A] sm:text-2xl">
                Smart Campus Operations Hub
              </h1>
              <p className="hidden text-sm text-slate-500 sm:block">
                SLIIT-inspired campus services portal
              </p>
            </div>
          </Link>

          <div className="hidden items-center gap-3 md:flex">
            {user ? (
              <>
                <div className="text-right">
                  <p className="text-sm font-semibold text-[#123A7A]">
                    {user.name || user.email}
                  </p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                    isAdmin
                      ? "bg-amber-100 text-amber-700"
                      : currentRole === "STAFF"
                        ? "bg-sky-100 text-sky-700"
                        : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {currentRole || "USER"}
                </span>
                <button
                  type="button"
                  onClick={logout}
                  className="rounded-full border border-[#2F80ED] px-5 py-2 text-sm font-semibold text-[#123A7A] transition hover:bg-[#EAF4FF]"
                >
                  Log Out
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="rounded-full border border-[#2F80ED] px-5 py-2 text-sm font-semibold text-[#123A7A] transition hover:bg-[#EAF4FF]"
              >
                Log In
              </Link>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-xl p-2 text-[#123A7A] transition hover:bg-slate-100 md:hidden"
          >
            {mobileOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>
      </header>

      {/* Desktop nav */}
      <nav className="hidden bg-[#2F3B46] text-white md:block">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-6 px-6 py-4 text-sm font-medium">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={navLinkClass}>
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="border-t border-slate-200 bg-[#2F3B46] px-4 py-4 md:hidden">
          <div className="mx-auto max-w-7xl space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={mobileNavLinkClass}
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}

            {user ? (
              <>
                <div className="rounded-xl bg-[#3E4C59] px-4 py-3 text-sm text-slate-200">
                  <p className="font-semibold text-white">
                    {user.name || user.email}
                  </p>
                  <p className="mt-1 text-xs">{user.email}</p>
                  <p className="mt-2 text-xs uppercase tracking-wider text-[#4FD1C5]">
                    {currentRole || "USER"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    logout();
                  }}
                  className="mt-3 block w-full rounded-xl bg-gradient-to-r from-[#4FD1C5] to-[#2F80ED] px-4 py-3 text-center text-sm font-semibold text-white shadow-md"
                >
                  Log Out
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="mt-3 block rounded-xl bg-gradient-to-r from-[#4FD1C5] to-[#2F80ED] px-4 py-3 text-center text-sm font-semibold text-white shadow-md"
              >
                Log In
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
