import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Fragment, useState } from "react";
import { Link, Outlet, NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Wrench,
  CalendarCheck,
  Mail,
  Star,
  Wallet,
} from "lucide-react";
import React from "react";

function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navLinks = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
    { to: "/dashboard/services", label: "Service", icon: Wrench },
    { to: "/dashboard/booking", label: "Booking", icon: CalendarCheck },
    { to: "/dashboard/messages", label: "Messages", icon: Mail },
    { to: "/dashboard/reviews", label: "Reviews", icon: Star },
    { to: "/dashboard/earnings", label: "Earnings", icon: Wallet },
  ];

  const renderNavLink = (link: (typeof navLinks)[0]) => (
    <NavLink
      key={link.to}
      to={link.to}
      end={link.end}
      className={({ isActive }) =>
        `py-2.5 px-4 flex items-center transition hover:bg-gray-100 ${
          isActive ? "bg-gray-100" : ""
        }`
      }
    >
      {({ isActive }) => {
        const Icon = link.icon;
        return (
          <>
            <Icon
              size={18}
              className={`mr-2 ${
                isActive ? "text-blue-500" : "text-gray-500"
              }`}
            />
            <span className={isActive ? "text-blue-500" : "text-gray-700"}>
              {link.label}
            </span>
          </>
        );
      }}
    </NavLink>
  );

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar for desktop */}
      <div className="hidden md:flex md:flex-shrink-0 w-64 bg-white shadow-md">
        <div className="flex flex-col w-full">
          <div className="p-4 border-b">
            <img src="/logo.png" alt="Logo" className="h-12 mx-auto" />
          </div>
          <nav className="flex-1 overflow-y-auto mt-6 space-y-1">
            {navLinks.map(renderNavLink)}
          </nav>
        </div>
      </div>

      {/* Mobile sidebar toggle */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-gray-600 p-2 bg-white rounded shadow focus:outline-none"
        >
          {sidebarOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Sidebar for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="w-64 bg-white shadow-md p-4 space-y-4">
            <img src="/logo.png" alt="Logo" className="h-12" />
            {navLinks.map((link) =>
              React.cloneElement(
                renderNavLink(link),
                {
                  key: link.to,
                  onClick: () => setSidebarOpen(false),
                }
              )
            )}
          </div>
          <div
            className="flex-grow bg-black bg-opacity-25"
            onClick={() => setSidebarOpen(false)}
          />
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-y-auto p-6">
        {/* Header */}
        <div className="flex justify-end items-center mb-4 relative">
          <Menu as="div" className="relative">
            <MenuButton className="flex items-center focus:outline-none">
              <img
                src="/user.jpg"
                alt="User"
                className="h-10 w-10 rounded-full mr-2 object-cover"
              />
              <div className="text-left">
                <div className="font-medium text-sm">Sarah Miller</div>
                <div className="text-gray-500 text-xs">Service Provider</div>
              </div>
            </MenuButton>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <MenuItems className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-1 z-50 ring-1 ring-black ring-opacity-5 focus:outline-none">
                <MenuItem>
                  {({ active }) => (
                    <Link
                      to="/dashboard/profile"
                      className={`block px-4 py-2 text-sm ${
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                      }`}
                    >
                      Profile
                    </Link>
                  )}
                </MenuItem>
                <MenuItem>
                  {({ active }) => (
                    <Link
                      to="/dashboard/settings"
                      className={`block px-4 py-2 text-sm ${
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                      }`}
                    >
                      Settings
                    </Link>
                  )}
                </MenuItem>
                <MenuItem>
                  {({ active }) => (
                    <button
                      onClick={() => alert("Logging out...")}
                      className={`w-full text-left px-4 py-2 text-sm ${
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                      }`}
                    >
                      Logout
                    </button>
                  )}
                </MenuItem>
              </MenuItems>
            </Transition>
          </Menu>
        </div>

        {/* Outlet for nested routes */}
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
