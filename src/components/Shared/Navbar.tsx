import logo from "@/assets/navlogo.png";
import { useUserStore } from "@/store/useUserStore";
import React, { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useUserStore();
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);

  // Define nav links based on user state
  const navLinks = user
    ? [
      { name: "Home", to: "/" },
      { name: "Party Generator", to: "/home/party-generator" },
      { name: "DIY Boxes", to: "/home/diyboxes" },
      { name: "Invitations", to: "/home/party-invitations" },
      { name: "Providers", to: "/home/providers" },
      { name: "Shop", to: "/home/shop" },
      { name: "Blog", to: "/home/blog" },
    ]
    : [
      { name: "Home", to: "/" },
      { name: "About", href: "#about" },
      { name: "Services", href: "#services" },
      { name: "Testimonial", href: "#testimonial" },
      { name: "Shop", to: "/home/shop" },
      { name: "Blog", to: "/home/blog" },
    ];

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };

  return (
    <nav className="bg-background relative container mx-auto flex max-w-[1440px] items-center justify-between border-b border-gray-200 px-4 py-2 lg:px-5">
      {/* Left: Logo */}
      <Link to="/" >
        <img src={logo} alt="Nav Logo" className="h-18 w-20" />
      </Link>

      {/* Middle: Nav Links (Desktop) */}
      <ul className="text-secondary hidden gap-6 text-base font-medium lg:flex">
        {navLinks.map((link) => (
          <li key={link.name}>
            {link.to ? (
              <Link
                to={link.to}
                className="hover:text-primary cursor-pointer transition"
              >
                {link.name}
              </Link>
            ) : (
              <a
                href={link.href}
                className="hover:text-primary cursor-pointer transition"
              >
                {link.name}
              </a>
            )}
          </li>
        ))}
      </ul>

      {/* Right: Buttons (Desktop) */}
      <div className="hidden items-center gap-4 lg:flex">
        {user ? (
          <>
            <Link
              to={"/home/premium-feature"}
              className="bg-secondary hover:bg-secondary-light cursor-pointer rounded-lg border px-4 py-2 text-white transition"
            >
              Premium
            </Link>
            <Link
              to={"/home/my-account"}
              className="cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-center text-gray-700 transition hover:bg-gray-50"
            >
              My Account
            </Link>
            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="cursor-pointer rounded-lg border border-red-400 px-4 py-2 text-center text-red-500 transition hover:bg-red-50"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/auth/login"
            className="border-primary text-primary hover:bg-primary cursor-pointer rounded-lg border px-5 py-2 transition hover:text-white"
          >
            Get Started for Free
          </Link>
        )}
      </div>

      {/* Hamburger Icon (Mobile) */}
      <div className="z-20 lg:hidden" onClick={toggleMenu}>
        {isOpen ? (
          <FiX size={24} className="text-primary cursor-pointer" />
        ) : (
          <FiMenu size={24} className="text-primary cursor-pointer" />
        )}
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="bg-background absolute top-full left-0 z-50 w-full border-t border-gray-200 shadow-lg transition lg:hidden">
          <ul className="text-secondary flex flex-col gap-4 px-6 py-4 text-base font-medium">
            {navLinks.map((link) => (
              <li key={link.name}>
                {link.to ? (
                  <Link
                    to={link.to}
                    onClick={toggleMenu}
                    className="hover:text-primary cursor-pointer transition"
                  >
                    {link.name}
                  </Link>
                ) : (
                  <a
                    href={link.href}
                    onClick={toggleMenu}
                    className="hover:text-primary cursor-pointer transition"
                  >
                    {link.name}
                  </a>
                )}
              </li>
            ))}
            <li>
              {user ? (
                <div className="flex flex-col gap-2">
                  <Link
                    to={"/home/premium-feature"}
                    className="bg-secondary hover:bg-secondary-dark rounded-lg border px-4 py-2 text-white transition"
                  >
                    Premium
                  </Link>
                  <Link
                    to={"/home/my-account"}
                    className="cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-center text-gray-700 transition hover:bg-gray-50"
                  >
                    My Account
                  </Link>
                  {/* Mobile Logout */}
                  <button
                    onClick={() => {
                      handleLogout();
                      toggleMenu();
                    }}
                    className="cursor-pointer rounded-lg border border-red-400 px-4 py-2 text-center text-red-500 transition hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/auth/login"
                  onClick={toggleMenu}
                  className="border-primary text-primary hover:bg-primary mt-2 w-full rounded-lg border px-5 py-2 transition hover:text-white"
                >
                  Get Started for Free
                </Link>
              )}
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
