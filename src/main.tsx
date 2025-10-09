// main.tsx or index.tsx
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

import DashboardLayout from "./Dashboard/DashboardLayout";
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
        path: "messages",
        element: <Messages />,
      },
      // {
      //   path: "chat-message",
      //   element: <ChatMessagePage />,
      // },
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
        element: <Earnings />,
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
    <ReduxProviderWrapper>
      <RouterProvider router={router} />
      <Toaster position="top-right" reverseOrder={false} />
    </ReduxProviderWrapper>
  </React.StrictMode>,
);

// /* eslint-disable @typescript-eslint/no-explicit-any */
// import * as React from "react";
// import type { JSX } from "react";
// import * as ReactDOM from "react-dom/client";
// import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import "./index.css";
// import { Toaster } from "react-hot-toast";

// // ✅ Layouts
// import LandingLayout from "./Layout/LandingLayout";
// import AuthLayout from "./Layout/Auth/AuthLayout";
// import MainLayout from "./Layout/MainLayout";
// import DashboardLayout from "./Dashboard/DashboardLayout";
// import AdminLayout from "./Layout/AdminLayout";

// // ✅ Pages
// import LandingPage from "./Pages/LandingPage";
// import Login from "./Pages/Authentication/Login";
// import SignUp from "./Pages/Authentication/SignUp";
// import ForgotPassword from "./Pages/Authentication/ForgotPassword";
// import ResetPassword from "./Pages/ResetPassword";
// import TestComponent from "./Pages/Authentication/TestComponent";
// import BecomeProvider from "./Pages/BecomeProvider";
// import Blog from "./Pages/Blog";
// import BlogDetails from "./components/Blog/BlogDetails";
// import DiyBoxes from "./Pages/DiyBoxes";
// import DiyBoxDetails from "./Pages/DiyBoxDetails";
// import PartyGenerator from "./Pages/PartyGenerator";
// import PartyInvitations from "./Pages/PartyInvitations";
// import Provider from "./Pages/Provider";
// import ProviderDetails from "./Pages/ProviderDetails";
// import RequestQuote from "./Pages/RequestQuote";
// import Shop from "./Pages/Shop";
// import ShopDetails from "./Pages/ShopDetails";
// import MyAccount from "./Pages/MyAccount";
// import CheckList from "./Pages/CheckList";
// import PremiumFeature from "./Pages/PremiumFeature";
// import MyCart from "./Pages/MyCart";
// import CustomTShirt from "./Pages/CustomTShirt";
// import TermsConditions from "./Pages/TermsConditions";
// import LegalNotice from "./Pages/LegalNotice";
// import PrivacyPolicy from "./Pages/PrivacyPolicy";
// import Faq from "./Pages/Faq";
// import ContactUs from "./Pages/ContactUs";
// import MyWishlist from "./Pages/MyWishlist";
// import Plan from "./Pages/Plan";
// import CheckoutPage from "./Pages/Checkout";

// // ✅ Dashboard Pages
// import DefaultPage from "./Dashboard/dashboardpages/DefaultPage";
// import Earnings from "./Dashboard/dashboardpages/Earnings";
// import Messages from "./Dashboard/dashboardpages/Messages";
// import Reviews from "./Dashboard/dashboardpages/Reviews";
// import Services from "./Dashboard/dashboardpages/Services";
// import BookingParent from "./Dashboard/dashboardpages/BookingParent";
// import ProviderQuotesPage from "./Pages/Provider/ProviderQuotesPage";
// import ProviderUpdateProfile from "./components/Provider/ProviderUpdateProfile";

// // ✅ Admin Pages
// import AdminDashboardPage from "./Pages/Admin/AdminDashboardPage";
// import AdminAddProductPage from "./Pages/Admin/AdminAddProductPage";
// import AdminAllUsersPage from "./Pages/Admin/AdminAllUsersPage";
// import AdminOrderPage from "./Pages/Admin/AdminOrderPage";
// import AdminCustomerOrderPage from "./Pages/Admin/AdminCustomerOrderPage";
// import AdminProviderManagementPage from "./Pages/Admin/AdminProviderManagementPage";
// import SubscriptionPlanPage from "./Pages/Admin/SubscriptionPlanPage";
// import NewsletterPage from "./Pages/Admin/NewsletterPage";
// import AdminUpdateProfile from "./components/Admin/AllUsers/AdminUpdateProfile";
// import ProviderPlanPage from "./Pages/Admin/ProviderPlanPage";

// // ✅ Redux Provider
// import ReduxProviderWrapper from "./redux/readux-provider/reduxProviderWrapper";
// import ProvidersList from "./components/Provider/ProvidersList";
// import ProviderPage from "./Pages/Provider/ProviderPage";
// import PaymentSuccess from "./components/Shared/PaymentSuccess";
// import DiyBoxChackout from "./Pages/DiyBoxChackout";
// import ChatMessagePage from "./Pages/ChatMessagePage";
// import AdminAddBlogPage from "./Pages/Admin/AdminAddBlogPage";

// // ✅ GOOGLE TRANSLATE SCRIPT INTEGRATION
// const useGoogleTranslate = () => {
//   React.useEffect(() => {
//     const apiKey = import.meta.env.VITE_GOOGLE_TRANSLATE_KEY;

//     // Avoid duplicate script load
//     if (document.getElementById("google-translate-script")) return;

//     const script = document.createElement("script");
//     script.id = "google-translate-script";
//     script.src = `https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit&key=${apiKey}`;
//     script.async = true;
//     document.body.appendChild(script);

//     (window as any).googleTranslateElementInit = () => {
//       new (window as any).google.translate.TranslateElement(
//         {
//           pageLanguage: "en",
//           includedLanguages: "en,fr,hi",
//           layout: (window as any).google.translate.TranslateElement.InlineLayout
//             .SIMPLE,
//         },
//         "google_translate_element",
//       );
//     };
//   }, []);
// };

// // ✅ Router Configuration
// // Define your router with type-safe components
// const router = createBrowserRouter([
//   // lanidng page routes
//   {
//     path: "/",
//     element: <LandingLayout />,
//     children: [
//       {
//         path: "/",
//         element: <LandingPage />,
//       },
//       {
//         path: "/success",
//         element: <PaymentSuccess />,
//       },
//     ],
//   },

//   // authentication routes
//   {
//     path: "/auth",
//     element: <AuthLayout />,
//     children: [
//       {
//         path: "/auth/login",
//         element: <Login />,
//       },
//       {
//         path: "/auth/signup",
//         element: <SignUp />,
//       },
//       {
//         path: "/auth/forgot-password",
//         element: <ForgotPassword />,
//       },
//       {
//         path: "/auth/test",
//         element: <TestComponent />,
//       },
//       {
//         path: "/auth/reset-password",
//         element: <ResetPassword></ResetPassword>,
//       },
//     ],
//   },

//   // main application routes
//   {
//     path: "/home",
//     element: <MainLayout />,
//     children: [
//       {
//         path: "/home",
//         element: <LandingPage />,
//       },
//       {
//         path: "party-generator",
//         element: <PartyGenerator />,
//       },
//       {
//         path: "diyboxes",
//         element: <DiyBoxes />,
//       },
//       {
//         path: "diyboxe/details/:id",
//         element: <DiyBoxDetails />,
//       },
//       {
//         path: "party-invitations",
//         element: <PartyInvitations />,
//       },
//       {
//         path: "providers",
//         element: <Provider />,
//       },
//       {
//         path: "become-provider",
//         element: <BecomeProvider />,
//       },
//       {
//         path: "provider/:id",
//         element: <ProviderDetails />,
//       },
//       {
//         path: "request-quote",
//         element: <RequestQuote />,
//       },
//       {
//         path: "shop",
//         element: <Shop />,
//       },
//       {
//         path: "shop/:id",
//         element: <ShopDetails />,
//       },
//       {
//         path: "blog",
//         element: <Blog />,
//       },
//       {
//         path: "blog/:id",
//         element: <BlogDetails />,
//       },
//       {
//         path: "my-account",
//         element: <MyAccount />,
//       },
//       {
//         path: "checklist",
//         element: <CheckList />,
//       },
//       {
//         path: "premium-feature",
//         element: <PremiumFeature />,
//       },
//       {
//         path: "my-cart",
//         element: <MyCart></MyCart>,
//       },
//       {
//         path: "custom-t-shirt",
//         element: <CustomTShirt />,
//       },
//       {
//         path: "terms-conditions",
//         element: <TermsConditions />,
//       },
//       {
//         path: "legal-notice",
//         element: <LegalNotice />,
//       },
//       {
//         path: "privacy-policy",
//         element: <PrivacyPolicy />,
//       },
//       {
//         path: "faq",
//         element: <Faq />,
//       },
//       {
//         path: "contact-us",
//         element: <ContactUs />,
//       },
//       {
//         path: "wishlist",
//         element: <MyWishlist />,
//       },
//       {
//         path: "plan",
//         element: <Plan />,
//       },

//       {
//         path: "checkout",
//         element: <CheckoutPage />,
//       },
//       {
//         path: "diyboxChackout",
//         element: <DiyBoxChackout />,
//       },
//     ],
//   },

//   // admin routes can be added here
//   {
//     path: "/dashboard",
//     element: <DashboardLayout />,
//     children: [
//       {
//         index: true,
//         element: <DefaultPage />,
//       },
//       {
//         path: "services",
//         element: <Services />,
//       },
//       {
//         path: "provider-quotes",
//         element: <ProviderQuotesPage />,
//       },
//       {
//         path: "providers",
//         element: <ProvidersList />,
//       },
//       {
//         path: "providers/:id",
//         element: <ProviderPage />,
//       },
//       {
//         path: "booking",
//         element: <BookingParent />,
//       },
//       {
//         path: "messages",
//         element: <Messages />,
//       },
//       {
//         path: "chat-message",
//         element: <ChatMessagePage />,
//       },

//       {
//         path: "reviews",
//         element: <Reviews />,
//       },
//       {
//         path: "earnings",
//         element: <Earnings />,
//       },
//       {
//         path: "provider-account",
//         element: <ProviderUpdateProfile />,
//       },
//     ],
//   },
//   // admin Dashboard routes can be added here
//   {
//     path: "/admin-dashboard",
//     element: <AdminLayout />,
//     children: [
//       {
//         index: true,
//         element: <AdminDashboardPage />,
//       },
//       {
//         path: "dashboard",
//         element: <AdminDashboardPage />,
//       },
//       {
//         path: "all-users",
//         element: <AdminAllUsersPage />,
//       },
//       {
//         path: "all-orders",
//         element: <AdminOrderPage />,
//       },
//       {
//         path: "all-customer-orders",
//         element: <AdminCustomerOrderPage />,
//       },
//       {
//         path: "provider-management",
//         element: <AdminProviderManagementPage />,
//       },
//       {
//         path: "add-product",
//         element: <AdminAddProductPage />,
//       },
//       {
//         path: "add-blog",
//         element: <AdminAddBlogPage />,
//       },
//       {
//         path: "subscription-plan",
//         element: <SubscriptionPlanPage />,
//       },
//       {
//         path: "news-letter",
//         element: <NewsletterPage />,
//       },
//       {
//         path: "admin-account",
//         element: <AdminUpdateProfile />,
//       },
//       {
//         path: "provider-plan",
//         element: <ProviderPlanPage />,
//       },
//       {
//         path: "messages",
//         element: <Messages />,
//       },
//       {
//         path: "reviews",
//         element: <Reviews />,
//       },
//       {
//         path: "earnings",
//         element: <Earnings />,
//       },
//     ],
//   },
// ]);

// // ✅ MAIN APP COMPONENT
// export const AppWithTranslate = (): JSX.Element => {
//   useGoogleTranslate();

//   return (
//     <>
//       <ReduxProviderWrapper>
//         <RouterProvider router={router} />
//         <Toaster position="top-right" reverseOrder={false} />

//         {/* 🌐 Google Translate Widget */}
//         <div
//           className=""
//           id="google_translate_element"
//           style={{
//             position: "fixed",
//             bottom: "24px",
//             right: "24px",
//             zIndex: 9999,
//             background: "rgba(255, 255, 255, 0.8)",
//             backdropFilter: "blur(10px)",
//             borderRadius: "12px",
//             padding: "4px 8px",
//             border: "1px solid rgba(255, 255, 255, 0.3)",
//             boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
//             fontFamily: "Inter, system-ui, sans-serif",
//             transition: "all 0.3s ease",
//             display: "flex",
//             alignItems: "center",
//             gap: "4px",
//             cursor: "pointer",
//           }}
//           onMouseEnter={(e) => {
//             (e.currentTarget as HTMLElement).style.boxShadow =
//               "0 10px 25px rgba(0, 0, 0, 0.15)";
//             (e.currentTarget as HTMLElement).style.transform =
//               "translateY(-2px)";
//           }}
//           onMouseLeave={(e) => {
//             (e.currentTarget as HTMLElement).style.boxShadow =
//               "0 8px 20px rgba(0, 0, 0, 0.1)";
//             (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
//           }}
//         >
//           🌐{" "}
//           <span style={{ fontSize: "14px", color: "#111827", fontWeight: 500 }}>
//             Translate
//           </span>
//         </div>
//       </ReduxProviderWrapper>
//     </>
//   );
// };

// // ✅ RENDER APP
// const rootElement = document.getElementById("root");
// if (!rootElement) throw new Error("Root element not found");

// ReactDOM.createRoot(rootElement).render(
//   <React.StrictMode>
//     <AppWithTranslate />
//   </React.StrictMode>,
// );
