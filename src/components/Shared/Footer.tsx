import footerlogo from "@/assets/footerlogo.png";
import {
  Facebook,
  Instagram,
  Mail,
  Phone,
  Twitter,
  Youtube,
} from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const Footer: React.FC = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  // Email validation function
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle email input change
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    // Clear error when user starts typing
    if (emailError) {
      setEmailError("");
    }
  };

  // Handle newsletter subscription
  const handleSubscribe = () => {
    // Validate email
    if (!email.trim()) {
      setEmailError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    // Clear any existing errors
    setEmailError("");

    // Show SweetAlert2 confirmation
    Swal.fire({
      title: "Newsletter Subscription",
      text: `Are you sure you want to subscribe with ${email}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, subscribe!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        // Show success message
        Swal.fire({
          title: "Subscribed!",
          text: "Thank you for subscribing to our newsletter!",
          icon: "success",
          confirmButtonColor: "#3085d6",
        });

        // Clear the email input
        setEmail("");
      }
    });
  };

  return (
    <div className="bg-secondary relative mt-48 w-full">
      {/* Curved Top */}
      <div className="absolute -top-14 right-0 left-0 -z-10 h-[300px] overflow-hidden md:-top-24">
        <div className="clip-footer-top bg-secondary h-full w-full" />
      </div>
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 text-white lg:px-5">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-3">
            {/* Get in touch section */}
            <div className="space-y-6">
              <h2 className="text-2xl font-medium">Get in touch</h2>
              <div className="space-y-4">
                <div className="text-base leading-relaxed">
                  Jln Cempaka Wangi No 22, Jakarta
                  <br />
                  Indonesia
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5" />
                  <span>hello@yourdomain.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5" />
                  <span>+6221.2002.2012</span>
                </div>
              </div>
            </div>

            {/* Center section with logo and social */}
            <div className="space-y-6 text-center">
              <Link
                to="/"
                className="flex justify-center"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                <img
                  src={footerlogo}
                  alt="Logo"
                  className="w-auto object-contain"
                />
              </Link>

              <h3 className="text-2xl font-medium">Let's fun together</h3>

              {/* Social media icons */}
              <div className="flex justify-center space-x-3">
                <div className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg bg-white transition-colors hover:bg-gray-100">
                  <Facebook className="text-secondary h-5 w-5" />
                </div>
                <div className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg bg-white transition-colors hover:bg-gray-100">
                  <Instagram className="text-secondary h-5 w-5" />
                </div>
                <div className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg bg-white transition-colors hover:bg-gray-100">
                  <Twitter className="text-secondary h-5 w-5" />
                </div>
                <div className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg bg-white transition-colors hover:bg-gray-100">
                  <Youtube className="text-secondary h-5 w-5" />
                </div>
              </div>
            </div>

            {/* Newsletter section */}
            <div className="space-y-6">
              <h2 className="text-2xl font-medium">Newsletter.</h2>
              <p className="leading-relaxed text-white">
                Signup for our newsletter to get updated information, insight,
                or promotions.
              </p>
              <div className="space-y-4">
                <div>
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={handleEmailChange}
                    className={`focus:ring-none w-full rounded-lg bg-white px-4 py-3 text-gray-800 placeholder-gray-500 focus:ring-2 focus:outline-none ${
                      emailError
                        ? "border-2 border-red-500 focus:ring-red-500"
                        : "focus:ring-blue-500"
                    }`}
                  />
                  {emailError && (
                    <p className="mt-2 text-sm text-red-300">{emailError}</p>
                  )}
                </div>
                <button
                  onClick={handleSubscribe}
                  className="bg-secondary-dark hover:bg-secondary-light w-full cursor-pointer rounded-lg px-6 py-3 font-medium text-white transition-colors"
                >
                  Get Started For Free
                </button>
              </div>
            </div>
          </div>

          {/* Bottom border */}
          <div className="mt-16 border-t border-[#FFFFFF2B] pt-8"></div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
