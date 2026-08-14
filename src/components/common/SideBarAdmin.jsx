import { 
  ChevronDown, 
  PhoneIncoming, 
  PhoneMissed, 
  PhoneOutgoing, 
  Power,
  LayoutDashboard,
  Phone,
  Layers,
  Settings,
  Users,
  GitFork,
  Cpu,
  BarChart3,
  HeartHandshake,
  Workflow,
  ShieldCheck,
  UserCheck,
  HelpCircle,
  LogOut,
  Sliders,
  Sparkles,
  Blocks,
  User
} from "lucide-react";
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCall } from "../../context/Call/CallContext"; 

import Button from "./Button";
import { useOutboundWS } from "../../pages/Calling/context/OutboundWSContext";
import { updateAgentPresence } from "../../services/realtime/stomp/stopm";

// دالة مساعدة للتحقق من وجود الصلاحية لدى المستخدم
const hasPermission = (requiredPermission) => {
  const permissions = JSON.parse(localStorage.getItem("permissions") || "[]");
  if (!requiredPermission) return true;
  if (Array.isArray(requiredPermission)) {
    return requiredPermission.some((perm) => permissions.includes(perm));
  }
  return permissions.includes(requiredPermission);
};

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
    <div
      className={`transition-colors duration-300 ${
        isActive ? "text-white" : "text-gray-400 hover:text-white"
      }`}
    >
      {children}
    </div>

    <span
      className={`uppercase tracking-widest text-[12px] font-bold transition-colors duration-300 ${
        isActive ? "text-white" : "text-gray-400 hover:text-white"
      }`}
    >
      {label}
    </span>
  </Link>
);

const SidebarDropdown = ({ label, children, activePaths }) => {
  const location = useLocation();
  
  const isSubItemActive = activePaths.some(path => location.pathname.startsWith(path));
  const [isOpen, setIsOpen] = React.useState(isSubItemActive);

  return (
    <div className="flex flex-col">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between w-full px-4  text-gray-400  ${
          isSubItemActive ? "text-gray-400" : ""
        }`}
      >
        <span className="uppercase tracking-widest px-4 py-2 text-[12px] font-bold">{label}</span>
       <ChevronDown
       className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
       />
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out pl-4 flex flex-col space-y-1 mt-1 ${
          isOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

const SidebarAdmin = ({ isOpen, toggleSidebar }) => {
  const { t } = useTranslation();
  const [isclickStatus, setIsClickStatus] = useState(false);
  const location = useLocation();
  
  const { wsStatus, callStatus, activeCall } = useCall();
  
  // استدعاء حالة الاتصال الخاصة بالـ Outbound
  const { isConnected: isOutboundConnected } = useOutboundWS();
  
  // تحديد ما إذا كان الوارد متصلاً بنجاح (مع WebSocket)
  const isConnected = wsStatus === "Connected";

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

  const currentStatus = statuses[0];
  const otherStatuses = statuses.slice(1);

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

  // دالة التعامل مع حالة Go Live / Go Offline للوكيل
  const handleToggleGoLive = (isGoLive) => {
    if (!user || !user.email) return;
    
    const targetStatus = isGoLive ? "AVAILABLE" : "OFFLINE";
    console.log(`تم تغيير الحالة إلى: ${targetStatus}`);
    
    updateAgentPresence(user.email, targetStatus, user.queueId || "1");
  };
  
  return (
    <>
      <div
        onClick={toggleSidebar}
        className={`fixed inset-0 bg-black/30 z-40 lg:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

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
              <div className="flex flex-col items-center mb-6 px-6 text-center">
              {user.image && (
        <div className="relative mb-4">
          <div className="w-24 h-24 rounded-2xl bg-gray-600 border-2 border-gray-700 shadow-lg overflow-hidden" />
          <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-4 border-[#0f172a] rounded-full" />
        </div>
      )}

      <div className="space-y-2">
        {/* نوع المستخدم في الأعلى */}
        <div>
          <span className="inline-block bg-sky-600 px-2.5 py-0.5 text-white rounded-full text-[10px] font-bold uppercase tracking-[0.2em]">
            {user.type}
          </span>
        </div>

        {/* الاسم والبريد معاً بدون مسافة فاصلة (space-y-0) */}
        <div className="space-y-0">
          <h2 className="text-white font-black text-lg tracking-wider uppercase leading-none mb-1">
            {user.firstName} {user.lastName}
          </h2>
          <p className="text-gray-400 font-medium text-sm tracking-wide">
            {user.email}
          </p>
        </div>
      </div>

            {/* أزرار Go Live / Go Offline */}
            <div className="flex items-center gap-2 w-full mt-1">
              <button
                onClick={() => handleToggleGoLive(true)}
                className="flex-1 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 py-1.5 px-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
              >
                <Power size={12} />
                {t('sidebar.available')}
              </button>
              <button
                onClick={() => handleToggleGoLive(false)}
                className="flex-1 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-400 py-1.5 px-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
              >
                <Power size={12} />
                {t('sidebar.offline')}
              </button>
            </div>

          </div>
        }

        {/* Main Navigation */}
        <nav className="flex-1 flex flex-col space-y-2">
          {/* حاوية مؤشرات الاتصال (الوارد والصادر) بجانب بعضهما */}
          <div className="flex flex-row items-center justify-between gap-2 px-2 mb-3 w-full">
            
            {/* مؤشر الاتصال الوارد (Inbound) */}
            <div className="flex items-center w-1/2 justify-center">
              <div className={`w-full py-2 px-1.5 rounded-xl flex items-center justify-center gap-1.5 border transition-all duration-300 ${
                isConnected 
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                  : "bg-rose-500/10 border-rose-500/20 text-rose-400"
              }`}>
                {isConnected ? (
                  <>
                    <PhoneIncoming className="animate-pulse shrink-0" size={14} />
                    <span className="text-[10px] font-bold tracking-tight uppercase truncate">
                      {activeCall ? `${t('sidebar.inCall')} (${callStatus})` : t('sidebar.incoming')}
                    </span>
                  </>
                ) : (
                  <>
                    <PhoneMissed className="animate-pulse shrink-0" size={14} />
                    <span className="text-[10px] font-bold tracking-tight uppercase truncate opacity-90">
                      {wsStatus || t('sidebar.offline')}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* مؤشر الاتصال الصادر (Outbound) */}
            <div className="flex items-center w-1/2 justify-center">
              <div className={`w-full py-2 px-1.5 rounded-xl flex items-center justify-center gap-1.5 border transition-all duration-300 ${
                isOutboundConnected 
                  ? "bg-sky-500/10 border-sky-500/20 text-sky-400" 
                  : "bg-rose-500/10 border-rose-500/20 text-rose-400"
              }`}>
                {isOutboundConnected ? (
                  <>
                    <PhoneOutgoing  className="animate-pulse shrink-0" size={14} />
                    <span className="text-[10px] font-bold tracking-tight uppercase truncate">
                      {t('sidebar.outgoing')}
                    </span>
                  </>
                ) : (
                  <>
                    <PhoneMissed className="animate-pulse shrink-0" size={14} />
                    <span className="text-[10px] font-bold tracking-tight uppercase truncate opacity-90">
                      {t('sidebar.outOffline')}
                    </span>
                  </>
                )}
              </div>
            </div>

          </div>

          <SidebarItem 
            path={'/main'}
            label={t('sidebar.dashboard')} 
            isActive={location.pathname === "/main"} 
          >
            <LayoutDashboard size={18} className="text-white" />
          </SidebarItem>

          <SidebarItem 
            path={'/main/calls'}
            label={t('sidebar.calls')} 
            isActive={location.pathname === "/main/calls"} 
          >
            <Phone size={18} className="text-white" />
          </SidebarItem>

          <SidebarItem 
            path={'/main/queue'}
            label={t('sidebar.queues')} 
            isActive={location.pathname === "/main/queue"} 
          >
            <Layers size={18} className="text-white" />
          </SidebarItem>

{hasPermission([
  "MANAGE_USERS", 
  "VIEW_ALL_TICKETS", 
  "VIEW_COMPANY_STRUCTURE", 
  "MANAGE_ROLES", 
  "VIEW_ANALYTICS",
  "VIEW_ASSIGNED_TICKETS",
  "UPDATE_TICKET_STATUS",
  "ADD_NOTE"
]) && (
  <SidebarItem 
    path={
      hasPermission(["VIEW_ASSIGNED_TICKETS", "UPDATE_TICKET_STATUS", "ADD_NOTE"]) &&
      !hasPermission(["MANAGE_USERS", "VIEW_ALL_TICKETS", "VIEW_COMPANY_STRUCTURE", "MANAGE_ROLES", "VIEW_ANALYTICS"])
        ? "/main/system/tickets"
        : "/main/system"
    }
    label={t('sidebar.system')}
    isActive={location.pathname.startsWith("/main/system")}
  >
    <Settings size={18} className="text-white" />
  </SidebarItem>
)}

          {hasPermission(["VIEW_TENANTS", "MANAGE_TENANT_STATUS", "CREATE_TENANT"]) && (
            <SidebarItem 
              path={"/main/tenants"}
              label={t('sidebar.tenantsManagement')}
              isActive={location.pathname.startsWith("/main/tenants")}
            >
              <Users size={18} className="text-white" />
            </SidebarItem>
          )}

          {hasPermission(["MANAGE_WORKFLOWS", "VIEW_WORKFLOWS"]) && (
            <SidebarItem 
              path={"/main/flow"}
              label={t('sidebar.ivrBuilderAndFlows')}
              isActive={location.pathname.startsWith("/main/flow")}
            >
              <GitFork size={18} className="text-white" />
            </SidebarItem>
          )}

          {hasPermission(["VIEW_WORKFLOWS", "MANAGE_WORKFLOWS"]) && (
            <SidebarItem 
              path={"/main/workengine"}
              label={t('sidebar.workflowRules')}
              isActive={location.pathname.startsWith("/main/workengine")}
            >
              <Cpu size={18} className="text-white" />
            </SidebarItem>
          )}
          
          {hasPermission(["VIEW_ANALYTICS", "VIEW_MONITORING", "VIEW_AUDIT_LOGS"]) && (
            <SidebarDropdown 
              label={t('sidebar.analytical')} 
              activePaths={["/main/performance", "/main/monitory", "/main/audit"]}
            >
              {hasPermission(["VIEW_ANALYTICS", "VIEW_MONITORING"]) && (
                <SidebarItem
                  path={"/main/performance"}
                  label={t('sidebar.agentsPerformance')}
                  isActive={location.pathname.startsWith("/main/performance")}
                >
                  <BarChart3 size={16} className="text-white" />
                </SidebarItem>
              )}
              {hasPermission("VIEW_MONITORING") && (
                <SidebarItem
                  path={"/main/monitory"}
                  label={t('sidebar.monitoring')}
                  isActive={location.pathname.startsWith("/main/monitory")}
                >
                  <Workflow size={16} className="text-white" />
                </SidebarItem>
              )}
              {hasPermission("VIEW_AUDIT_LOGS") && (
                <SidebarItem
                  path={"/main/audit"}
                  label={t('sidebar.auditingLogs')}
                  isActive={location.pathname.startsWith("/main/audit")}
                >
                  <ShieldCheck size={16} className="text-white" />
                </SidebarItem>
              )}
            </SidebarDropdown>
          )}

          <SidebarDropdown 
            label={t('sidebar.crmModule')} 
            activePaths={["/main/customers", "/main/contacts", "/main/audit"]}
          >
            <SidebarItem
              path={"/main/customers"}
              label={t('sidebar.customers')}
              isActive={location.pathname.startsWith("/main/customers")}
            >
              <UserCheck size={16} className="text-white" />
            </SidebarItem>
            <SidebarItem
              path={"/main/campaigns"}
              label={t('sidebar.campaigns')}
              isActive={location.pathname.startsWith("/main/campaigns")}
            >
              <Sparkles size={16} className="text-white" />
            </SidebarItem>
            <SidebarItem
              path={"/main/leads"}
              label={t('sidebar.leads')}
              isActive={location.pathname.startsWith("/main/leads")}
            >
              <Sliders size={16} className="text-white" />
            </SidebarItem>
          </SidebarDropdown>
        </nav>

        {/* Bottom Actions */}
        <div className="mt-auto border-t border-gray-800 pt-6">
          <SidebarItem 
            label={t('sidebar.integrations')}
            isBottom={true}
            path={'/main/integration'}
            isActive={location.pathname === "/main/integration"} 
          >
            <Blocks size={18} className="text-white" />
          </SidebarItem>
          
          <SidebarItem 
            path={'/main/profile'}
            label={t('sidebar.myProfile')} 
            isActive={location.pathname === "/main/profile"} 
          >
            <User size={18} className="text-white" />
          </SidebarItem>
          
          <SidebarItem
            path={'/main/doc'}
            label={t('sidebar.documentationCallx')} 
            isBottom={true} 
            isActive={location.pathname === "/main/doc"} 
          >
            <HelpCircle size={18} className="text-white" />
          </SidebarItem>
          
          <SidebarItem label={t('sidebar.logout')} isBottom={true}>
            <LogOut size={18} className="text-white" />
          </SidebarItem>
        </div>
      </div>
    </>
  );
};

export default SidebarAdmin;