import {
  FiChevronDown,
  FiMenu,
  FiShoppingCart,
  FiUser,
  FiX,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import logo from "../../assets/navlogo-new.png";
import { User } from "lucide-react";
import { useSelector } from "react-redux";
import type { AppRootState } from "@/redux/store";
import { useEffect, useRef, useState } from "react";
import GoogleTranslate from "./GoogleTranslate";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const storedUser = localStorage.getItem("user");
  const userName = localStorage.getItem("userName");
  const userRole = localStorage.getItem("userRole"); // 'admin', 'provider', 'user'
  const user = storedUser ? JSON.parse(storedUser) : null;

  const menuRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const cart = useSelector((state: AppRootState) => state.cart.items);

  const navLinks = user
    ? [
        { name: "Home", to: "/" },
        { name: "Party Generator", to: "/home/party-generator" },
        { name: "DIY Boxes", to: "/home/diyboxes" },
        { name: "Invitations", to: "/home/party-invitations" },
        { name: "Providers", to: "/home/providers" },
        { name: "Shop", to: "/home/shop" },
        { name: "Custom T-Shirt", to: "/home/custom-t-shirt" },
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

  const getDashboardUrl = () => {
    if (userRole === "ADMIN") return "/admin-dashboard";
    if (userRole === "PROVIDER") return "/dashboard";
    return "/home/my-account"; // default user
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    localStorage.removeItem("userRole");
    window.location.href = "/auth/login";
  };

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleDropdown = () => {
    setAccountOpen(!accountOpen);
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setAccountOpen(false);
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getTotalCartItems = () =>
    cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="bg-background relative container mx-auto flex max-w-[1440px] items-center justify-between border-b border-gray-200 px-4 lg:px-5">
      {/* Logo */}
      <Link to="/">
        <img src={logo} className="h-20" alt="Logo" />
      </Link>

      {/* Desktop nav links */}
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

      {/* Desktop cart & user */}
      <div className="hidden items-center gap-4 lg:flex">
       
          <GoogleTranslate />
        
        <Link
          to="/home/my-cart"
          className="relative flex items-center gap-1 rounded-lg p-2 transition hover:bg-gray-50"
        >
          <FiShoppingCart
            size={24}
            className="text-secondary hover:text-gray-800"
          />
          {cart.length > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              {getTotalCartItems()}
            </span>
          )}
        </Link>

        {!user && (
          <Link
            to="/auth/login"
            onClick={toggleMenu}
            className="border-primary text-primary hover:bg-primary block rounded-lg border px-5 py-2 text-center transition hover:text-white"
          >
            Get Started for Free
          </Link>
        )}

        {user && (
          <div className="relative flex gap-3" ref={dropdownRef}>
            <Link to="/home/premium-feature">
              <button className="bg-secondary cursor-pointer rounded-3xl px-5 py-2 text-white">
                Premium
              </button>
            </Link>
            <button
              onClick={toggleDropdown}
              className="flex cursor-pointer items-center gap-2 rounded-full border border-gray-300 p-1 px-2 transition hover:bg-gray-50"
            >
              <User />

              {userName?.split(" ")[0]}
              <FiChevronDown
                size={16}
                className={`transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {accountOpen && (
              <div className="absolute right-0 z-[9999] mt-15 w-40 rounded-lg border border-[#D1D5DC] bg-white py-3 shadow-lg transition-all duration-200">
                <Link
                  to={getDashboardUrl()}
                  className="block rounded-xl px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => setAccountOpen(false)}
                >
                  My Account
                </Link>
                <Link
                  to="/home/wishlist"
                  className="block rounded-xl px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => setAccountOpen(false)}
                >
                  My Wishlist
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full cursor-pointer rounded-xl px-4 py-2 text-left text-red-500 hover:bg-red-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile icons */}
      <div className="flex items-center gap-3 lg:hidden">
        <GoogleTranslate />
        <Link to="/home/my-cart" className="relative p-1">
          <FiShoppingCart size={24} className="text-gray-800" />
          {cart.length > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              {getTotalCartItems()}
            </span>
          )}
        </Link>

        <div className="z-20" onClick={toggleMenu}>
          {isOpen ? (
            <FiX size={24} className="text-primary cursor-pointer" />
          ) : (
            <FiMenu size={24} className="text-primary cursor-pointer" />
          )}
        </div>
      </div>

      {/* Mobile menu */}
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
                    className="hover:text-primary block cursor-pointer py-1 transition"
                  >
                    {link.name}
                  </Link>
                ) : (
                  <HashLink
                    smooth
                    to={link.hash!}
                    onClick={toggleMenu}
                    className="hover:text-primary block cursor-pointer py-1 transition"
                  >
                    {link.name}
                  </HashLink>
                )}
              </li>
            ))}

            {user ? (
              <>
                <hr className="my-2 border-gray-200" />
                <li>
                  <Link
                    to={getDashboardUrl()}
                    onClick={toggleMenu}
                    className="hover:text-primary flex items-center gap-2 py-2 text-gray-700 transition"
                  >
                    <FiUser size={18} />
                    My Account
                  </Link>
                </li>
                <li>
                  <Link
                    to="/home/wishlist"
                    onClick={toggleMenu}
                    className="hover:text-primary flex items-center gap-2 py-2 text-gray-700 transition"
                  >
                    ❤️ Wishlist
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => {
                      handleLogout();
                      toggleMenu();
                    }}
                    className="flex w-full items-center gap-2 py-2 text-left text-red-500 transition hover:text-red-600"
                  >
                    <FiX size={18} />
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <hr className="my-2 border-gray-200" />
                <li>
                  <Link
                    to="/auth/login"
                    onClick={toggleMenu}
                    className="border-primary text-primary hover:bg-primary block rounded-lg border px-5 py-2 text-center transition hover:text-white"
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
