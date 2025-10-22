import NavLogo from "@/assets/navlogo-new.png";
import { DashboardIcon, ServicesIcon } from "@/Dashboard/Icons";
import { logOut } from "@/redux/features/auth/authSlice";
import { useGetMeQuery } from "@/redux/features/user/userApi";
import { useAppDispatch } from "@/redux/hooks/redux-hook";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import {
  Bars3Icon,
  ChevronDownIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Fragment, useEffect, useState } from "react";
import { FaBlogger, FaJediOrder, FaUsers } from "react-icons/fa";
import { GoProjectSymlink } from "react-icons/go";
import { MdHome, MdOutlineAddChart } from "react-icons/md";
import { RiListOrdered } from "react-icons/ri";
import { TbActivity } from "react-icons/tb";
import { FaAffiliatetheme } from "react-icons/fa";

import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const { data: me } = useGetMeQuery();

  // Close mobile sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [location]);

  // Handle escape key for mobile sidebar
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent): void => {
      if (e.key === "Escape") setSidebarOpen(false);
    };
    if (sidebarOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [sidebarOpen]);

  const navLinks = [
    {
      to: "/admin-dashboard/dashboard",
      label: "Dashboard",
      icon: DashboardIcon,
      end: true,
    },
    {
      to: "/",
      label: "Home",
      icon: MdHome,
    },
    {
      to: "/admin-dashboard/all-users",
      label: "All Users",
      icon: FaUsers,
    },
    {
      to: "/admin-dashboard/all-orders",
      label: "All Orders",
      icon: RiListOrdered,
    },
    {
      to: "/admin-dashboard/all-customer-orders",
      label: "All Custom Orders",
      icon: FaJediOrder,
    },
    {
      to: "/admin-dashboard/provider-management",
      label: "Provider Management",
      icon: GoProjectSymlink,
    },
    {
      to: "/admin-dashboard/add-product",
      label: "Add Product",
      icon: MdOutlineAddChart,
    },
    {
      to: "/admin-dashboard/add-blog",
      label: "Add Blog",
      icon: FaBlogger,
    },
    {
      to: "/admin-dashboard/add-diyactivity",
      label: "Add Diy Activity",
      icon: TbActivity 
,
    },
    {
      to: "/admin-dashboard/add-IAffiliatedProduct",
      label: "Add Affiliated Product",
      icon: FaAffiliatetheme 
,
    },
    {
      to: "/admin-dashboard/news-letter",
      label: "News Letter",
      icon: ServicesIcon,
    },
    // {
    //   to: "/admin-dashboard/reviews",
    //   label: "Reviews",
    //   icon: ReviewsIcon,
    // },
  ];

  const NavItem = ({
    link,
    onClick,
    collapsed = false,
  }: {
    link: (typeof navLinks)[0];
    onClick: () => void;
    collapsed?: boolean;
  }) => (
    <NavLink
      to={link.to}
      end={link.end}
      onClick={onClick}
      className={({ isActive }) =>
        `group focus:ring-secondary-light/60 relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200 ease-in-out hover:bg-gray-50 hover:text-gray-900 focus:ring-2 focus:ring-offset-2 focus:outline-none ${
          isActive
            ? "text-secondary border-secondary border-r-2 bg-blue-50 font-bold"
            : "font-medium text-gray-700 hover:text-gray-900"
        } ${collapsed ? "justify-center px-2" : ""}`
      }
    >
      {({ isActive }) => (
        <>
          <link.icon
            className={`h-5 w-5 flex-shrink-0 transition-colors ${
              isActive
                ? "text-secondary"
                : "text-gray-500 group-hover:text-gray-700"
            }`}
            isActive={isActive}
          />
          {!collapsed && <span className="truncate">{link.label}</span>}
        </>
      )}
    </NavLink>
  );

  const SidebarContent = ({
    collapsed = false,
    onItemClick,
  }: {
    collapsed?: boolean;
    onItemClick: () => void;
  }) => (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <Link
        to={"/"}
        className={`flex items-center justify-center bg-white ${collapsed ? "px-1 py-3" : "px-3 py-2"}`}
      >
        <img
          src={NavLogo}
          alt="Company Logo"
          className={`transition-all duration-300 ${collapsed ? "h-10 w-10" : "h-20 w-auto"}`}
        />
      </Link>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-6">
        <div className="space-y-3">
          {navLinks.map((link) => (
            <NavItem
              key={link.to}
              link={link}
              onClick={onItemClick}
              collapsed={collapsed}
            />
          ))}
        </div>
      </nav>

      {/* Collapse Toggle (Desktop only) */}
      {!collapsed && (
        <div className="hidden border-t border-gray-200 p-3 lg:block">
          <button
            onClick={() => setIsCollapsed(true)}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900"
            aria-label="Collapse sidebar"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
              />
            </svg>
            <span>Collapse</span>
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Sidebar */}
      <Transition show={sidebarOpen} as={Fragment}>
        <div className="fixed inset-y-0 left-0 z-50 w-64 lg:hidden">
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <div className="flex h-full flex-col bg-white shadow-xl">
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  type="button"
                  className="ml-1 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full focus:ring-2 focus:ring-white focus:outline-none focus:ring-inset"
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="sr-only">Close sidebar</span>
                  <XMarkIcon
                    className="h-6 w-6 text-white"
                    aria-hidden="true"
                  />
                </button>
              </div>
              <SidebarContent onItemClick={() => setSidebarOpen(false)} />
            </div>
          </Transition.Child>
        </div>
      </Transition>

      {/* Desktop Sidebar */}
      <div
        className={`hidden transition-all duration-300 lg:flex lg:flex-shrink-0 ${isCollapsed ? "lg:w-16" : "lg:w-64"}`}
      >
        <div className="flex w-full flex-col border-r border-gray-200 bg-white shadow-sm">
          <SidebarContent collapsed={isCollapsed} onItemClick={() => {}} />
          {isCollapsed && (
            <div className="border-t border-gray-200 p-2">
              <button
                onClick={() => setIsCollapsed(false)}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 transition-colors hover:bg-gray-50"
                aria-label="Expand sidebar"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 5l7 7-7 7M5 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top Header */}
        <header className="relative z-10 flex h-16 flex-shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm lg:px-6">
          {/* Mobile menu button */}
          <button
            type="button"
            className="focus:ring-secondary-light/60 cursor-pointer text-gray-500 focus:ring-2 focus:outline-none focus:ring-inset lg:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>

          {/* Header content */}
          <div className="flex flex-1 items-center justify-end gap-4">
            {/* User Menu */}
            <Menu as="div" className="relative">
              <MenuButton className="focus:ring-secondary-light/60 flex cursor-pointer items-center gap-3 rounded-lg bg-white p-1.5 text-sm hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:outline-none">
                {me?.profile_image && (
                  <img
                    className="h-8 w-8 rounded-full object-cover ring-2 ring-gray-200"
                    src={me.profile_image}
                    alt={me.name ?? "https://i.pravatar.cc/40"}
                  />
                )}
                <div className="hidden text-left lg:block">
                  <p className="text-sm font-medium text-gray-900">
                    {me?.name}(admin)
                  </p>
                  <p className="text-xs text-gray-500">Admin Profile</p>
                </div>
                <ChevronDownIcon
                  className="hidden h-4 w-4 text-gray-400 lg:block"
                  aria-hidden="true"
                />
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
                <MenuItems className="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
                  <div className="border-b border-gray-100 px-4 py-3">
                    <p className="text-sm font-medium text-gray-900">
                      {me?.name}
                    </p>
                    <p className="text-sm text-gray-500">{me?.email}</p>
                  </div>
                  <div className="px-4">
                    <button
                      onClick={() =>
                        navigate("/admin-dashboard/admin-account", {
                          state: { initialTab: "Profile" },
                        })
                      }
                      className="block w-full cursor-pointer py-2 text-left text-sm text-gray-500 transition-colors"
                    >
                      My Profile
                    </button>
                  </div>
                  <div className="border-t border-gray-100 py-1">
                    <MenuItem>
                      {({ focus }) => (
                        <button
                          onClick={() => {
                            dispatch(logOut());
                            navigate("/auth/login");
                          }}
                          className={`block w-full cursor-pointer px-4 py-2 text-left text-sm transition-colors ${
                            focus ? "bg-gray-50 text-gray-900" : "text-gray-700"
                          }`}
                        >
                          Sign Out
                        </button>
                      )}
                    </MenuItem>
                  </div>
                </MenuItems>
              </Transition>
            </Menu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;

// import NavLogo from "@/assets/navlogo-new.png";
// import {
//   DashboardIcon,
//   // EarningsIcon,
//   MessagesIcon,
//   ReviewsIcon,
//   ServicesIcon,
// } from "@/Dashboard/Icons";
// import { logOut } from "@/redux/features/auth/authSlice";
// import { useGetMeQuery } from "@/redux/features/user/userApi";
// import { useAppDispatch } from "@/redux/hooks/redux-hook";
// import {
//   Menu,
//   MenuButton,
//   MenuItem,
//   MenuItems,
//   Transition,
// } from "@headlessui/react";
// import {
//   Bars3Icon,
//   ChevronDownIcon,
//   XMarkIcon,
// } from "@heroicons/react/24/outline";
// import { Fragment, useEffect, useState } from "react";
// import { FaFileInvoiceDollar, FaJediOrder, FaUsers } from "react-icons/fa";
// import { FaMoneyCheckDollar } from "react-icons/fa6";
// import { GoProjectSymlink } from "react-icons/go";
// import { MdHome, MdOutlineAddChart } from "react-icons/md";
// import { RiListOrdered } from "react-icons/ri";

// import { Link, NavLink, Outlet, useLocation } from "react-router-dom";

// import { useNavigate } from "react-router-dom";

// function AdminLayout() {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation();

//   const dispatch = useAppDispatch();

//   const { data: me } = useGetMeQuery();
//   console.log(me);

//   // Close mobile sidebar on route change
//   useEffect(() => {
//     setSidebarOpen(false);
//   }, [location]);

//   // Handle escape key for mobile sidebar
//   useEffect(() => {
//     const handleEscape = (e: KeyboardEvent): void => {
//       if (e.key === "Escape") setSidebarOpen(false);
//     };
//     if (sidebarOpen) {
//       document.addEventListener("keydown", handleEscape);
//       return () => document.removeEventListener("keydown", handleEscape);
//     }
//   }, [sidebarOpen]);

//   const navLinks = [
//     {
//       to: "/admin-dashboard/dashboard",
//       label: "Dashboard",
//       icon: DashboardIcon,
//       end: true,
//     },
//     {
//       to: "/",
//       label: "Home",
//       icon: MdHome,
//     },
//     {
//       to: "/admin-dashboard/all-users",
//       label: "All Users",
//       icon: FaUsers,
//     },
//     {
//       to: "/admin-dashboard/all-orders",
//       label: "All Orders",
//       icon: RiListOrdered,
//     },
//     {
//       to: "/admin-dashboard/all-customer-orders",
//       label: "All Custom Orders",
//       icon: FaJediOrder,
//     },
//     {
//       to: "/admin-dashboard/provider-management",
//       label: "Provider Management",
//       icon: GoProjectSymlink,
//     },
//     {
//       to: "/admin-dashboard/add-product",
//       label: "Add Product",
//       icon: MdOutlineAddChart,
//     },
//     {
//       to: "/admin-dashboard/add-blog",
//       label: "Add Blog",
//       icon: MdOutlineAddChart,
//     },{
//       to: "/admin-dashboard/add-diyactivity",
//       label: "Add Diy Activity",
//       icon: FaJediOrder,
//     },
//     {
//       to: "/admin-dashboard/subscription-plan",
//       label: "General Plan",
//       icon: FaMoneyCheckDollar,
//     },
//     {
//       to: "/admin-dashboard/provider-plan",
//       label: "Provider Plan",
//       icon: FaFileInvoiceDollar,
//     },
//     {
//       to: "/admin-dashboard/news-letter",
//       label: "News Letter",
//       icon: ServicesIcon,
//     },

//     {
//       to: "/admin-dashboard/messages",
//       label: "Messages",
//       icon: MessagesIcon,
//       badge: 3, // Example notification badge
//     },
//     {
//       to: "/admin-dashboard/reviews",
//       label: "Reviews",
//       icon: ReviewsIcon,
//     },
//     // {
//     //   to: "/admin-dashboard/earnings",
//     //   label: "Earnings",
//     //   icon: EarningsIcon,
//     // },
//   ];

//   const NavItem = ({
//     link,
//     onClick,
//     collapsed = false,
//   }: {
//     link: (typeof navLinks)[0];
//     onClick: () => void;
//     collapsed?: boolean;
//   }) => (
//     <NavLink
//       to={link.to}
//       end={link.end}
//       onClick={onClick}
//       className={({ isActive }) =>
//         `group focus:ring-secondary-light/60 relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200 ease-in-out hover:bg-gray-50 hover:text-gray-900 focus:ring-2 focus:ring-offset-2 focus:outline-none ${
//           isActive
//             ? "text-secondary border-secondary border-r-2 bg-blue-50 font-bold"
//             : "font-medium text-gray-700 hover:text-gray-900"
//         } ${collapsed ? "justify-center px-2" : ""}`
//       }
//     >
//       {({ isActive }) => (
//         <>
//           <link.icon
//             className={`h-5 w-5 flex-shrink-0 transition-colors ${
//               isActive
//                 ? "text-secondary"
//                 : "text-gray-500 group-hover:text-gray-700"
//             }`}
//             isActive={isActive}
//           />
//           {!collapsed && (
//             <>
//               <span className="truncate">{link.label}</span>
//               {link.badge && (
//                 <span className="ml-auto inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
//                   {link.badge}
//                 </span>
//               )}
//             </>
//           )}
//           {collapsed && link.badge && (
//             <span className="absolute -top-1 -right-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
//               {link.badge}
//             </span>
//           )}
//         </>
//       )}
//     </NavLink>
//   );

//   const SidebarContent = ({
//     collapsed = false,
//     onItemClick,
//   }: {
//     collapsed?: boolean;
//     onItemClick: () => void;
//   }) => (
//     <div className="flex h-full flex-col">
//       {/* Logo */}
//       <Link
//         to={"/"}
//         className={`flex items-center justify-center bg-white ${collapsed ? "px-1 py-3" : "px-3 py-2"}`}
//       >
//         <img
//           src={NavLogo}
//           alt="Company Logo"
//           className={`transition-all duration-300 ${collapsed ? "h-10 w-10" : "h-20 w-auto"}`}
//         />
//         {/* <NavLogo className={`transition-all duration-300 ${collapsed ? "h-10" : "h-24 w-auto"}`} /> */}
//       </Link>

//       {/* Navigation */}
//       <nav className="flex-1 overflow-y-auto px-3 py-6">
//         <div className="space-y-3">
//           {navLinks.map((link) => (
//             <NavItem
//               key={link.to}
//               link={link}
//               onClick={onItemClick}
//               collapsed={collapsed}
//             />
//           ))}
//         </div>
//       </nav>

//       {/* Collapse Toggle (Desktop only) */}
//       {!collapsed && (
//         <div className="hidden border-t border-gray-200 p-3 lg:block">
//           <button
//             onClick={() => setIsCollapsed(true)}
//             className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900"
//             aria-label="Collapse sidebar"
//           >
//             <svg
//               className="h-5 w-5"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
//               />
//             </svg>
//             <span>Collapse</span>
//           </button>
//         </div>
//       )}
//     </div>
//   );

//   return (
//     <div className="flex h-screen overflow-hidden bg-gray-50">
//       {/* Mobile Overlay */}
//       {sidebarOpen && (
//         <div
//           className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm lg:hidden"
//           onClick={() => setSidebarOpen(false)}
//           aria-hidden="true"
//         />
//       )}

//       {/* Mobile Sidebar */}
//       <Transition show={sidebarOpen} as={Fragment}>
//         <div className="fixed inset-y-0 left-0 z-50 w-64 lg:hidden">
//           <Transition.Child
//             as={Fragment}
//             enter="transition ease-in-out duration-300"
//             enterFrom="-translate-x-full"
//             enterTo="translate-x-0"
//             leave="transition ease-in-out duration-300"
//             leaveFrom="translate-x-0"
//             leaveTo="-translate-x-full"
//           >
//             <div className="flex h-full flex-col bg-white shadow-xl">
//               <div className="absolute top-0 right-0 -mr-12 pt-2">
//                 <button
//                   type="button"
//                   className="ml-1 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full focus:ring-2 focus:ring-white focus:outline-none focus:ring-inset"
//                   onClick={() => setSidebarOpen(false)}
//                 >
//                   <span className="sr-only">Close sidebar</span>
//                   <XMarkIcon
//                     className="h-6 w-6 text-white"
//                     aria-hidden="true"
//                   />
//                 </button>
//               </div>
//               <SidebarContent onItemClick={() => setSidebarOpen(false)} />
//             </div>
//           </Transition.Child>
//         </div>
//       </Transition>

//       {/* Desktop Sidebar */}
//       <div
//         className={`hidden transition-all duration-300 lg:flex lg:flex-shrink-0 ${isCollapsed ? "lg:w-16" : "lg:w-64"}`}
//       >
//         <div className="flex w-full flex-col border-r border-gray-200 bg-white shadow-sm">
//           <SidebarContent collapsed={isCollapsed} onItemClick={() => {}} />
//           {isCollapsed && (
//             <div className="border-t border-gray-200 p-2">
//               <button
//                 onClick={() => setIsCollapsed(false)}
//                 className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 transition-colors hover:bg-gray-50"
//                 aria-label="Expand sidebar"
//               >
//                 <svg
//                   className="h-5 w-5"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M13 5l7 7-7 7M5 5l7 7-7 7"
//                   />
//                 </svg>
//               </button>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Main Content Area */}
//       <div className="flex min-w-0 flex-1 flex-col">
//         {/* Top Header */}
//         <header className="relative z-10 flex h-16 flex-shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm lg:px-6">
//           {/* Mobile menu button */}
//           <button
//             type="button"
//             className="focus:ring-secondary-light/60 cursor-pointer text-gray-500 focus:ring-2 focus:outline-none focus:ring-inset lg:hidden"
//             onClick={() => setSidebarOpen(true)}
//             aria-label="Open sidebar"
//           >
//             <Bars3Icon className="h-6 w-6" aria-hidden="true" />
//           </button>

//           {/* Header content */}
//           <div className="flex flex-1 items-center justify-end gap-4">
//             {/* Notifications */}
//             {/* <button
//               type="button"
//               className="relative rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
//               aria-label="View notifications"
//             >
//               <BellIcon className="h-6 w-6" aria-hidden="true" />
//               <span className="absolute -top-1 -right-1 block h-3 w-3 rounded-full bg-red-400 ring-2 ring-white" />
//             </button> */}

//             {/* User Menu */}
//             <Menu as="div" className="relative">
//               <MenuButton className="focus:ring-secondary-light/60 flex cursor-pointer items-center gap-3 rounded-lg bg-white p-1.5 text-sm hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:outline-none">
//                 {me?.profile_image && (
//                   <img
//                     className="h-8 w-8 rounded-full object-cover ring-2 ring-gray-200"
//                     src={me.profile_image}
//                     alt={me.name ?? "https://i.pravatar.cc/40"}
//                   />
//                 )}
//                 <div className="hidden text-left lg:block">
//                   <p className="text-sm font-medium text-gray-900">
//                     {me?.name}(admin)
//                   </p>
//                   <p className="text-xs text-gray-500">Admin Profile</p>
//                 </div>
//                 <ChevronDownIcon
//                   className="hidden h-4 w-4 text-gray-400 lg:block"
//                   aria-hidden="true"
//                 />
//               </MenuButton>

//               <Transition
//                 as={Fragment}
//                 enter="transition ease-out duration-100"
//                 enterFrom="transform opacity-0 scale-95"
//                 enterTo="transform opacity-100 scale-100"
//                 leave="transition ease-in duration-75"
//                 leaveFrom="transform opacity-100 scale-100"
//                 leaveTo="transform opacity-0 scale-95"
//               >
//                 <MenuItems className="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
//                   <div className="border-b border-gray-100 px-4 py-3">
//                     <p className="text-sm font-medium text-gray-900">
//                       {me?.name}
//                     </p>
//                     <p className="text-sm text-gray-500">{me?.email}</p>
//                   </div>
//                   <div className="px-4">
//                     <button
//                       onClick={() =>
//                         navigate("/admin-dashboard/admin-account", {
//                           state: { initialTab: "Profile" },
//                         })
//                       }
//                       className="block w-full cursor-pointer py-2 text-left text-sm text-gray-500 transition-colors"
//                     >
//                       My Profile
//                     </button>

//                     {/* Render PartyInvitations only when button is clicked */}
//                   </div>
//                   <div className="py-1">
//                     {/* <MenuItem>
//                       {({ focus }) => (
//                         <Link
//                           to="/dashboard/profile"
//                           className={`block px-4 py-2 text-sm transition-colors ${focus ? 'bg-gray-50 text-gray-900' : 'text-gray-700'
//                             }`}
//                         >
//                           View Profile
//                         </Link>
//                       )}
//                     </MenuItem> */}
//                     {/* <MenuItem>
//                       {({ focus }) => (
//                         <Link
//                           to="/dashboard/settings"
//                           className={`block px-4 py-2 text-sm transition-colors ${focus ? 'bg-gray-50 text-gray-900' : 'text-gray-700'
//                             }`}
//                         >
//                           Settings
//                         </Link>
//                       )}
//                     </MenuItem> */}
//                     {/* <MenuItem>
//                       {({ focus }) => (
//                         <Link
//                           to="/help"
//                           className={`block px-4 py-2 text-sm transition-colors ${focus ? 'bg-gray-50 text-gray-900' : 'text-gray-700'
//                             }`}
//                         >
//                           Help & Support
//                         </Link>
//                       )}
//                     </MenuItem> */}
//                   </div>
//                   <div className="border-t border-gray-100 py-1">
//                     <MenuItem>
//                       {({ focus }) => (
//                         <button
//                           onClick={() => {
//                             dispatch(logOut()); // clear Redux + cookies + localStorage
//                             navigate("/auth/login"); // redirect to login page
//                           }}
//                           className={`block w-full cursor-pointer px-4 py-2 text-left text-sm transition-colors ${
//                             focus ? "bg-gray-50 text-gray-900" : "text-gray-700"
//                           }`}
//                         >
//                           Sign Out
//                         </button>
//                       )}
//                     </MenuItem>
//                   </div>
//                 </MenuItems>
//               </Transition>
//             </Menu>
//           </div>
//         </header>

//         {/* Page Content */}
//         <main className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6 lg:p-8">
//           <div className="mx-auto w-full">
//             <Outlet />
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }

// export default AdminLayout;
