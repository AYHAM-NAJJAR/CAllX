import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const SidebarItem = ({
  children,
  label,
  path,
  isActive = false,
}) => (
  <Link
    to={path}
    className={`
      flex items-center gap-4 px-4 py-2 cursor-pointer rounded-xl
      
      ${
        isActive
          ? "border-2 border-[#0D9EF2] text-white "
          : "text-gray-400 hover:text-white hover:bg-[#1a202c] hover:scale-[1.02]"
      }
    `}
  >
    {/* تأكد من أن الأيقونة تتغير ألوانها بسلاسة أيضاً */}
    <div
      className={`transition-colors duration-300 ${
        isActive ? "text-white" : "text-gray-400"
      }`}
    >
      {children}
    </div>

    <span
      className={`uppercase tracking-widest text-[12px] font-bold transition-colors duration-300 ${
        isActive ? "text-white" : "text-gray-400"
      }`}
    >
      {label}
    </span>
  </Link>
);

const SidebarAdmin = ({ isOpen, toggleSidebar }) => {
  const [isclickStatus, setIsClickStatus] = useState(false);
  const location = useLocation();
  // جميع الحالات داخل مصفوفة
  const [statuses, setStatuses] = useState([
    {
      id: 1,
      text: "Active",
      bg: "bg-[#142926]",
      textColor: "text-green-500",
      dot: "bg-green-500",
    },
    {
      id: 2,
      text: "Away",
      bg: "bg-blue-400",
      textColor: "text-blue-950",
      dot: "bg-blue-950",
    },
    {
      id: 3,
      text: "On Break",
      bg: "bg-red-500",
      textColor: "text-white",
      dot: "bg-red-700",
    },
  ]);

  // أول عنصر هو الحالي
  const currentStatus = statuses[0];

  // الباقي يظهر داخل القائمة
  const otherStatuses = statuses.slice(1);

  // تبديل العناصر داخل المصفوفة
  const handleStatusChange = (selectedStatus) => {
    const updatedStatuses = [
      selectedStatus,
      ...statuses.filter((status) => status.id !== selectedStatus.id),
    ];

    setStatuses(updatedStatuses);
    setIsClickStatus(false);
  };
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  
  return (
    <>
      {/* Overlay */}
      <div
        onClick={toggleSidebar}
        className={`fixed inset-0 bg-black/30 z-40 lg:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      {/* Sidebar */}
      <div
        className={`
          h-full bg-secondary text-white p-4 flex flex-col gap-5 z-50
          transition-transform duration-300 ease-in-out
          overflow-y-auto custom-scrollbar
          fixed top-0 left-0 
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:static lg:translate-x-0 lg:w-full
        `}
      >
        {/* Profile Section */}
          {user && 
           <div className="flex flex-col items-center mb-10 px-6 text-center">
            {user.image && 
            <div className="relative mb-4">
            <div className="w-24 h-24 rounded-2xl bg-gray-600 border-2 border-gray-700 shadow-lg" />
            <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-4 border-[#0f172a] rounded-full" />
            </div>
          }
            <div className="space-y-0.5 ">
            

            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em]">
              {user.type}
            </p>
          </div>
          <p className="text-white font-black text-lg tracking-wider uppercase ">
            {user.firstName} {user.lastName}
          </p>
          <p className="text-gray-700 font-black tracking-wider mb-2">
            {user.email}
          </p>

          {/* Status Dropdown */}
          <div className="relative flex flex-col items-center">
            {/* Current Status */}
            <div
              className={`${currentStatus.bg} px-4 py-1 rounded-full mb-2 transition-all duration-300`}
            >
              <button
                onClick={() => setIsClickStatus((prev) => !prev)}
                className={`text-[10px] font-bold uppercase flex items-center gap-2 ${currentStatus.textColor}`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full animate-pulse ${currentStatus.dot}`}
                />
                {currentStatus.text}
              </button>
            </div>

            {/* Dropdown */}
            <div
              className={`
                overflow-hidden transition-all duration-300 ease-in-out
                flex flex-col gap-2
                ${
                  isclickStatus
                    ? "max-h-40 opacity-100 translate-y-0"
                    : "max-h-0 opacity-0 -translate-y-2"
                }
              `}
            >
              {otherStatuses.map((status) => (
                <div
                  key={status.id}
                  className={`${status.bg}  px-4 py-1 rounded-full transition-all duration-300 `}
                >
                  <button
                    onClick={() => handleStatusChange(status)}
                    className={`text-[10px]  cursor-pointer font-bold uppercase flex items-center gap-2 ${status.textColor}`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full animate-pulse ${status.dot}`}
                    />

                    {status.text}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Info */}
          
        </div>

          }
        {/* Main Navigation */}
        <nav className="flex-1 flex flex-col space-y-2">
          

          <SidebarItem 
          path={'/main'}
          label="Dashboard" 
          isActive={location.pathname === "/main"} />

          <SidebarItem 
          path={'/main/calling'}
          label="Calling" 
          isActive={location.pathname === "/calling"} />

          

          <SidebarItem 
          path={"/main/system"}
          label="System"
          isActive={location.pathname.startsWith("/main/system")}
          />
          <SidebarItem 
          path={"/main/workengine"}
          label="Workflow Rules"
          isActive={location.pathname.startsWith("/main/workengine")}
          />

          <SidebarItem label="Performance" />
        </nav>

        {/* Bottom Actions */}
        <div className="mt-auto border-t border-gray-800 pt-6">
          <SidebarItem label="Support" isBottom={true} />
          <SidebarItem 
          path={'/main/profile'}
          label="My Profile" 
          isActive={location.pathname === "/main/profile"} />
          <SidebarItem label="Logout" isBottom={true} />
        </div>
      </div>
    </>
  );
};

export default SidebarAdmin;