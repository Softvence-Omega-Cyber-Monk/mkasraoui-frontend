// main.tsx or index.tsx
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

import DashboardLayout from "./Dashboard/DashboardLayout";
import DefaultPage from "./Dashboard/dashboardpages/DefaultPage";
import Earnings from "./Dashboard/dashboardpages/Earnings";
// import Messages from "./Dashboard/dashboardpages/Messages";
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
// import BlogDetails from "./Pages/BlogDetails";
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
import MyCart from "./Pages/MyCart";
import { Toaster } from "react-hot-toast";
import CustomTShirt from "./Pages/CustomTShirt";
import TermsConditions from "./Pages/TermsConditions";
import LegalNotice from "./Pages/LegalNotice";
import PrivacyPolicy from "./Pages/PrivacyPolicy";
import Faq from "./Pages/Faq";
import ContactUs from "./Pages/ContactUs";
import MyWishlist from "./Pages/MyWishlist";
import ReduxProviderWrapper from "./redux/readux-provider/reduxProviderWrapper";
// import BlogDetails from "./Pages/BlogDetails";
import BlogDetails from "./components/Blog/BlogDetails";
import AdminLayout from "./Layout/AdminLayout";
import AdminDashboardPage from "./Pages/Admin/AdminDashboardPage";
import AdminAddProductPage from "./Pages/Admin/AdminAddProductPage";
import AdminAllUsersPage from "./Pages/Admin/AdminAllUsersPage";
import Plan from "./Pages/Plan";
import BookingParent from "./Dashboard/dashboardpages/BookingParent";
import AdminProviderManagementPage from "./Pages/Admin/AdminProviderManagementPage";
import SubscriptionPlanPage from "./Pages/Admin/SubscriptionPlanPage";
import CheckoutPage from "./Pages/Checkout";
import ProviderPlanPage from "./Pages/Admin/ProviderPlanPage";
import NewsletterPage from "./Pages/Admin/NewsletterPage";
import AdminUpdateProfile from "./components/Admin/AllUsers/AdminUpdateProfile";
import ProviderUpdateProfile from "./components/Provider/ProviderUpdateProfile";
import ProviderQuotesPage from "./Pages/Provider/ProviderQuotesPage";
import AdminOrderPage from "./Pages/Admin/AdminOrderPage";
import AdminCustomerOrderPage from "./Pages/Admin/AdminCustomerOrderPage";
// import ChatMessagePage from "./Pages/ChatMessagePage";
import ProviderPage from "./Pages/Provider/ProviderPage";
import ProvidersList from "./components/Provider/ProvidersList";
import DiyBoxChackout from "./Pages/DiyBoxChackout";
// import ChatMessagePage from "./Pages/ChatMessagePage";
import AdminAddBlogPage from "./Pages/Admin/AdminAddBlogPage";
// import ChatMessagePage from "./Pages/ChatMessagePage";
import ChatContainer from "./components/mychat/ChatContainer";
import ProviderPaymentPage from "./Pages/Provider/ProviderPaymentPage";
import PaymentSuccess from "./components/Shared/PaymentSuccess";
import AdminDiyActivity from "./components/AdminDiyActivity/AdminDiyActivity";
import Earning from "./Dashboard/dashboardpages/Earning";
import DiyActivities from "./components/DiyActivityes/DiyActivities";
import DiyBoxActivityDetails from "./components/DiyActivityes/DiyBoxActivityDetails";
// import { SocketProvider } from "./services/SocketContext";
// import ChatMessagePage from "./components/mychat/ChatMessagePage";

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
      {
        path: "/success",
        element: <PaymentSuccess />,
      },
      {
        path: "userChat",
        element: <ChatContainer />,
      },
        {
        path: "/diyboxeactivity",
        element: <DiyActivities />
      },

      {
        path: "/diyboxeactivity/activity/:id",
        element: <DiyBoxActivityDetails />
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
      {
        path: "my-cart",
        element: <MyCart></MyCart>,
      },
      {
        path: "custom-t-shirt",
        element: <CustomTShirt />,
      },
      {
        path: "terms-conditions",
        element: <TermsConditions />,
      },
      {
        path: "legal-notice",
        element: <LegalNotice />,
      },
      {
        path: "privacy-policy",
        element: <PrivacyPolicy />,
      },
      {
        path: "faq",
        element: <Faq />,
      },
      {
        path: "contact-us",
        element: <ContactUs />,
      },
      {
        path: "wishlist",
        element: <MyWishlist />,
      },
      {
        path: "plan",
        element: <Plan />,
      },

      {
        path: "checkout",
        element: <CheckoutPage />,
      },
      {
        path: "diyboxChackout",
        element: <DiyBoxChackout />,
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
        path: "provider-quotes",
        element: <ProviderQuotesPage />,
      },
      {
        path: "providers",
        element: <ProvidersList />,
      },
      {
        path: "providers/:id",
        element: <ProviderPage />,
      },
      {
        path: "booking",
        element: <BookingParent />,
      },
      {
        path: "myChat",
        element: <ChatContainer />,
      },

      {
        path: "reviews",
        element: <Reviews />,
      },
      {
        path: "earnings",
        element: <Earning />,
      },
      {
        path: "provider-account",
        element: <ProviderUpdateProfile />,
      },
      {
        path: "payment",
        element: <ProviderPaymentPage />,
      },
      // i added taht
    ],
  },
  // admin Dashboard routes can be added here
  {
    path: "/admin-dashboard",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <AdminDashboardPage />,
      },
      {
        path: "dashboard",
        element: <AdminDashboardPage />,
      },
      {
        path: "all-users",
        element: <AdminAllUsersPage />,
      },
      {
        path: "all-orders",
        element: <AdminOrderPage />,
      },
      {
        path: "all-customer-orders",
        element: <AdminCustomerOrderPage />,
      },
      {
        path: "provider-management",
        element: <AdminProviderManagementPage />,
      },
      {
        path: "add-product",
        element: <AdminAddProductPage />,
      },
      {
        path: "add-blog",
        element: <AdminAddBlogPage />,
      },
      {
        path: "add-diyactivity",
        element: <AdminDiyActivity />,
      },
      {
        path: "subscription-plan",
        element: <SubscriptionPlanPage />,
      },
      {
        path: "news-letter",
        element: <NewsletterPage />,
      },
      {
        path: "admin-account",
        element: <AdminUpdateProfile />,
      },
      {
        path: "provider-plan",
        element: <ProviderPlanPage />,
      },
      // {
      //   path: "messages",
      //   element: <Messages />,
      // },
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
    <ReduxProviderWrapper>
      <RouterProvider router={router} />
      <Toaster position="top-right" reverseOrder={false} />
    </ReduxProviderWrapper>
  </React.StrictMode>,
);
