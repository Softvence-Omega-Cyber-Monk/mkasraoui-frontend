import { useCartStore, useUserStore } from "@/store/useUserStore";
import React, { useEffect, useRef, useState } from "react";
import { FiChevronDown, FiMenu, FiShoppingCart, FiUser, FiX } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import logo from "../../assets/navlogo-new.png";
import { CgProfile } from "react-icons/cg";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, logout } = useUserStore();
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const cart = useCartStore((state) => state.cart);
  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

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
      { name: "About", hash: "/#about" },
      { name: "Services", hash: "/#services" },
      { name: "Testimonial", hash: "/#testimonial" },
      { name: "Providers", to: "/home/providers" },
      { name: "Shop", to: "/home/shop" },
      { name: "Blog", to: "/home/blog" },
    ];

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
    setIsDropdownOpen(false);
  };

  // Handle outside click for mobile menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);


  // Handle outside click for dropdown menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const getTotalCartItems = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };


  return (
    <nav className="bg-background relative container mx-auto flex max-w-[1440px] items-center justify-between border-b border-gray-200 px-4 lg:px-5">
      {/* Left: Logo */}
      <Link to="/">
        <img src={logo} className="h-20" alt="Logo" />
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
              <HashLink
                smooth
                to={link.hash!}
                className="hover:text-primary cursor-pointer transition"
              >
                {link.name}
              </HashLink>
            )}
          </li>
        ))}
      </ul>


      {/* Right: Cart, User Actions (Desktop) */}
      <div className="hidden items-center gap-4 lg:flex">
        {/* Cart - Always visible */}
        <Link
          to="/home/my-cart"
          className="relative flex items-center gap-1 p-2 rounded-lg hover:bg-gray-50 transition"
        >
          <FiShoppingCart size={24} className="text-secondary hover:text-gray-800" />
          {cart.length > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              {getTotalCartItems()}
            </span>
          )}
        </Link>


        {user ? (
          <>
            {/* Premium Button */}
            <Link

              to="/home/premium-feature"
              className="bg-secondary hover:bg-secondary-light cursor-pointer rounded-lg border px-4 py-2 text-white transition"
            >
              <FiShoppingCart size={24} />
              My Cart
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-3 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </Link>

            {/* User Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className="flex items-center gap-2 rounded-full border border-gray-300 p-1 cursor-pointer hover:bg-gray-50 transition"
              >
                <img
                  src={"https://i.pravatar.cc/150?img=3"}
                  alt="User Avatar"
                  className="h-8 w-8 rounded-full object-cover"
                />
                <FiChevronDown
                  size={16}
                  className={`transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="py-2">
                    <Link
                      to="/home/my-account"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 transition"
                    >
                      <FiUser size={16} />
                      My Account
                    </Link>
                    <hr className="my-1 border-gray-100" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2 text-red-500 hover:bg-red-50 transition text-left"
                    >
                      <FiX size={16} />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>

          </>
        )}
      </div>

      {/* Hamburger Icon (Mobile) */}
      <div className="flex items-center gap-3 lg:hidden">
        {/* Cart for mobile - always visible */}
        <Link to="/home/my-cart" className="relative p-1">
          <FiShoppingCart size={24} className="text-gray-800" />
          {cart.length > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              {getTotalCartItems()}
            </span>
          )}
        </Link>

        {/* Hamburger menu */}
        <div className="z-20" onClick={toggleMenu}>
          {isOpen ? (
            <FiX size={24} className="text-primary cursor-pointer" />
          ) : (
            <FiMenu size={24} className="text-primary cursor-pointer" />
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div
          ref={menuRef}
          className="bg-background absolute top-full left-0 z-50 w-full border-t border-gray-200 shadow-lg transition lg:hidden"
        >
          <ul className="text-secondary flex flex-col gap-4 px-6 py-4 text-base font-medium">
            {navLinks.map((link) => (
              <li key={link.name}>
                {link.to ? (
                  <Link
                    to={link.to}
                    onClick={toggleMenu}
                    className="hover:text-primary cursor-pointer transition block py-1"
                  >
                    {link.name}
                  </Link>
                ) : (
                  <HashLink
                    smooth
                    to={link.hash!}
                    onClick={toggleMenu}
                    className="hover:text-primary cursor-pointer transition block py-1"
                  >
                    {link.name}
                  </HashLink>
                )}
              </li>
            ))}
            {/* User Actions in Mobile */}
            {user ? (
              <>
                <hr className="border-gray-200 my-2" />
                <li>

                  <Link
                    to="/home/premium-feature"
                    onClick={toggleMenu}
                    className="bg-secondary hover:bg-secondary-light block rounded-lg px-4 py-2 text-white transition text-center"
                  >
                    Premium
                  </Link>
                </li>
                <li>
                  <Link
                    to="/home/my-account"
                    onClick={toggleMenu}
                    className="flex items-center gap-2 py-2 text-gray-700 hover:text-primary transition"
                  >
                    <FiUser size={18} />
                    My Account
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => {
                      handleLogout();
                      toggleMenu();
                    }}
                    className="flex items-center gap-2 py-2 text-red-500 hover:text-red-600 transition w-full text-left"
                  >
                    <FiX size={18} />
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <hr className="border-gray-200 my-2" />
                <li>
                  <Link
                    to="/auth/login"
                    onClick={toggleMenu}
                    className="border-primary text-primary hover:bg-primary block rounded-lg border px-5 py-2 transition hover:text-white text-center"
                  >
                    Get Started for Free
                  </Link>
                </li>
              </>
            )}

          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
