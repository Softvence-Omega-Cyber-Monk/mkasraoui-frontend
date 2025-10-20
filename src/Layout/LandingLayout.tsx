import { Outlet, useLocation } from "react-router-dom";
import Footer from "../components/Shared/Footer";
import Navbar from "../components/Shared/Navbar";

const LandingLayout = () => {
  const location = useLocation();

  // Hide footer only on /userChat
  const hideFooter = location.pathname === "/userChat";

  return (
    <div>
      <Navbar />
      <div className="">
        <Outlet />
      </div>
      {!hideFooter && <Footer />}
    </div>
  );
};

export default LandingLayout;

// import { Outlet } from "react-router-dom";
// import Footer from "../components/Shared/Footer";
// import Navbar from "../components/Shared/Navbar";

// const LandingLayout = () => {
//   return (
//     <div>
//       <Navbar />
//       <div className="min-h-screen">
//         <Outlet />
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default LandingLayout;
