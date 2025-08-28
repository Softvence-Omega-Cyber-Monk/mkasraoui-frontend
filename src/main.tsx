// main.tsx or index.tsx
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

import DashboardLayout from "./Dashboard/DashboardLayout";
import Booking from "./Dashboard/dashboardpages/Booking";
import DefaultPage from "./Dashboard/dashboardpages/DefaultPage";
import Earnings from "./Dashboard/dashboardpages/Earnings";
import Messages from "./Dashboard/dashboardpages/Messages";
import Reviews from "./Dashboard/dashboardpages/Reviews";
import Services from "./Dashboard/dashboardpages/Services";
import AuthLayout from "./Layout/Auth/AuthLayout";
import LandingLayout from "./Layout/LandingLayout";
import MainLayout from "./Layout/MainLayout";
import ForgotPassword from "./Pages/Authentication/ForgotPassword";
import Login from "./Pages/Authentication/Login";
import SignUp from "./Pages/Authentication/SignUp";
import TestComponent from "./Pages/Authentication/TestComponent";
import BecomeProvider from "./Pages/BecomeProvider";
import Blog from "./Pages/Blog";
import BlogDetails from "./Pages/BlogDetails";
import DiyBoxDetails from "./Pages/DiyBoxDetails";
import DiyBoxes from "./Pages/DiyBoxes";
import LandingPage from "./Pages/LandingPage";
import MyAccount from "./Pages/MyAccount";
import PartyGenerator from "./Pages/PartyGenerator";
import PartyInvitations from "./Pages/PartyInvitations";
import PremiumFeature from "./Pages/PremiumFeature";
import Provider from "./Pages/Provider";
import ProviderDetails from "./Pages/ProviderDetails";
import RequestQuote from "./Pages/RequestQuote";
import Shop from "./Pages/Shop";
import ShopDetails from "./Pages/ShopDetails";
import CheckList from "./Pages/CheckList";
import ResetPassword from "./Pages/ResetPassword";

// Define your router with type-safe components
const router = createBrowserRouter([
  // lanidng page routes
  {
    path: "/",
    element: <LandingLayout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
    ],
  },

  // authentication routes
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        path: "/auth/login",
        element: <Login />,
      },
      {
        path: "/auth/signup",
        element: <SignUp />,
      },
      {
        path: "/auth/forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "/auth/test",
        element: <TestComponent />,
      },
      {
        path: "/auth/reset-password",
        element: <ResetPassword></ResetPassword>,
      },
    ],
  },

  // main application routes
  {
    path: "/home",
    element: <MainLayout />,
    children: [
      {
        path: "/home",
        element: <LandingPage />,
      },
      {
        path: "party-generator",
        element: <PartyGenerator />,
      },
      {
        path: "diyboxes",
        element: <DiyBoxes />,
      },
      {
        path: "diyboxe/details/:id",
        element: <DiyBoxDetails />,
      },
      {
        path: "party-invitations",
        element: <PartyInvitations />,
      },
      {
        path: "providers",
        element: <Provider />,
      },
      {
        path: "become-provider",
        element: <BecomeProvider />,
      },
      {
        path: "provider/:id",
        element: <ProviderDetails />,
      },
      {
        path: "request-quote",
        element: <RequestQuote />,
      },
      {
        path: "shop",
        element: <Shop />,
      },
      {
        path: "shop/:id",
        element: <ShopDetails />,
      },
      {
        path: "blog",
        element: <Blog />,
      },
      {
        path: "blog/:id",
        element: <BlogDetails />,
      },
      {
        path: "my-account",
        element: <MyAccount />,
      },
      {
        path: "checklist",
        element: <CheckList />,
      },
      {
        path: "premium-feature",
        element: <PremiumFeature />,
      },
    ],
  },

  // admin routes can be added here
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <DefaultPage />,
      },
      {
        path: "services",
        element: <Services />,
      },
      {
        path: "booking",
        element: <Booking />,
      },
      {
        path: "messages",
        element: <Messages />,
      },
      {
        path: "reviews",
        element: <Reviews />,
      },
      {
        path: "earnings",
        element: <Earnings />,
      },
    ],
  },
]);

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
