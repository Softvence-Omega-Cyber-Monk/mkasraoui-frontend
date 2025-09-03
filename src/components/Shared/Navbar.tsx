import { useCartStore, useUserStore } from "@/store/useUserStore";
import React, { useEffect, useRef, useState } from "react";
import { FiMenu, FiShoppingCart, FiX } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import logo from "../../assets/navlogo-new.png";
import { CgProfile } from "react-icons/cg";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useUserStore();
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleMenu = () => setIsOpen(!isOpen);
  const cart = useCartStore((state) => state.cart);
  // For account dropdown
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  // console.log("my store card", cart);

  const navLinks = user
    ? [
        { name: "Home", to: "/" },
        { name: "Party Generator", to: "/home/party-generator" },
        { name: "DIY Boxes", to: "/home/diyboxes" },
        { name: "Invitations", to: "/home/party-invitations" },
        { name: "Providers", to: "/home/providers" },
        { name: "Shop", to: "/home/shop" },
        { name: "Blog", to: "/home/blog" },
        { name: "Customize T-Shirt", to: "custom-t-shirt" },
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
  };

  // 🔥 Detect outside click
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

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        accountRef.current &&
        !accountRef.current.contains(event.target as Node)
      ) {
        setAccountOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside); // ← change here
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
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

      {/* Right: Buttons (Desktop) */}
      <div className="hidden items-center gap-2 lg:flex">
        {user ? (
          <>
            <Link
              to="/home/my-cart"
              className="relative mr-2 flex items-center gap-1"
            >
              <FiShoppingCart size={24} />
              My Cart
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-3 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </Link>

            <div className="relative z-50" ref={accountRef}>
              <button
                onClick={() => setAccountOpen(!accountOpen)}
                className="cursor-pointer rounded-lg px-4 py-2 text-center text-gray-700 transition hover:bg-gray-50"
              >
                <CgProfile className="text-3xl" />
              </button>

              {accountOpen && (
                <div
                  className="absolute right-0 z-[9999] mt-2 w-40 rounded-lg border bg-white py-3 shadow-lg transition-all duration-200"
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <Link
                    to="/home/my-account"
                    className="block rounded-xl px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => setAccountOpen(false)}
                  >
                    My Account
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setAccountOpen(false);
                    }}
                    className="block w-full rounded-xl px-4 py-2 text-left text-red-500 hover:bg-red-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link
              to="/home/my-cart"
              className="relative mr-2 flex items-center gap-1"
            >
              <FiShoppingCart size={24} />
              My Cart
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-3 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </Link>
            <Link
              to="/auth/login"
              className="border-primary text-primary hover:bg-primary cursor-pointer rounded-lg border px-5 py-2 transition hover:text-white"
            >
              Get Started for Free
            </Link>
          </>
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
                    className="hover:text-primary cursor-pointer transition"
                  >
                    {link.name}
                  </Link>
                ) : (
                  <HashLink
                    smooth
                    to={link.hash!}
                    onClick={toggleMenu}
                    className="hover:text-primary cursor-pointer transition"
                  >
                    {link.name}
                  </HashLink>
                )}
              </li>
            ))}
            <li>
              {user ? (
                <div className="flex flex-col gap-2">
                  <Link
                    to="/home/my-cart"
                    onClick={toggleMenu}
                    className="relative mr-2 mb-2 flex items-center"
                  >
                    <FiShoppingCart size={24} className="mr-2" />
                    My Cart
                    {cart.length > 0 && (
                      <span className="absolute -top-2 -right-3 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                        {cart.reduce((sum, item) => sum + item.quantity, 0)}
                      </span>
                    )}
                  </Link>
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
                <>
                  <Link
                    to="/home/my-cart"
                    onClick={toggleMenu}
                    className="relative mr-2 mb-6 flex items-center gap-1"
                  >
                    <FiShoppingCart size={24} />
                    My Cart
                    {cart.length > 0 && (
                      <span className="absolute -top-2 -right-3 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                        {cart.reduce((sum, item) => sum + item.quantity, 0)}
                      </span>
                    )}
                  </Link>
                  <Link
                    to="/auth/login"
                    onClick={toggleMenu}
                    className="border-primary text-primary hover:bg-primary mt-2 w-full rounded-lg border px-5 py-2 transition hover:text-white"
                  >
                    Get Started for Free
                  </Link>
                </>
              )}
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
