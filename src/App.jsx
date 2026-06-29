import React, { useEffect, useState } from "react";
import './config/i18n/i18n';
import { Navigate, Route, Routes } from "react-router-dom";
import { useTranslation } from 'react-i18next'; 
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";


import PermissionGuard from "./components/logic/PermissionGuard"; 
import Login from "./pages/auth/Login";
import CreateFieldDefinition from "./pages/Ticketing/CreateFieldDefinition";
import CreateDepartment from "./pages/CompanyStructure/CreateDepartment";
import CreateCategoryToDepartment from "./pages/CompanyStructure/CreateCategoryToDepartment";
import CreateRole from "./pages/Roles&Permissions/CreatRole";
import CreateEmployee from "./pages/UserManagement/employees/CreateEmployee";
import { queryClient } from "./config/reactQuery/configReactQuery";

import Panel from "./pages/dashboard/Panel"
import ServiceDown from "./pages/common/ServiceDown";
import GetAllEmployees from "./pages/UserManagement/employees/GetAllEmployees";
import Modal from 'react-modal';
import MainDashboard from "./pages/dashboard/MainDashboard";
import System from "./pages/dashboard/System";
import ShowAllTickets from "./pages/Ticketing/ShowAllTickets";
import EmployeeDetails from "./pages/UserManagement/employees/EmployeeDetails";
import BuildTicketStructrue from "./pages/Ticketing/BuildTicketStructrue";
import AllActiveFields from "./pages/Ticketing/AllActiveFields";
import IVR from "./pages/Calling/IVR/IVR";
import IVRCatalog from "./pages/Calling/IVR/IVRCatalog";
import GetAllDepartments from "./pages/CompanyStructure/GetAllDepartments";
import Profile from "./pages/profile/Profile";
import GetAllRoles from "./pages/Roles&Permissions/GetAllRoles";
import AllFields from "./pages/Ticketing/AllFields";
import AllInActiveFields from "./pages/Ticketing/AllInActiveFields";
import CallDashboard from "./pages/Calling/CallDashboard";
import CreateWorkFlowRules from "./pages/workflowEngine/CreateWorkFlowRules";
import GetAllWorkFlowEngines from "./pages/workflowEngine/GetAllWorkFlowEngines";
import WorkFlowDetail from "./pages/workflowEngine/WorkFlowDetail";
import AgentTerminal from "./pages/Calling/CallDashboard";
import MainPerformance from "./pages/performance/AgentsPerformance";
import SystemStats from "./pages/dashboard/SystemStats";
import TicketDetails from "./pages/Ticketing/Ticket Details";
import AllFlows from "./pages/Calling/IVR/AllFlows";
import AgentsPerformance from "./pages/performance/AgentsPerformance";
import Monitory from "./pages/monitoring/Monitory";
import AuditLogs from "./pages/monitoring/AuditLogs";
import ShowAllTenants from "./pages/Tenants/ShowAllTenants";
Modal.setAppElement('#root');

function App() {
  const { i18n } = useTranslation(); // استدعاء i18n لمعرفة اللغة الحالية
  const isAuthenticated = !!localStorage.getItem("token");
  const [errorInfo, setErrorInfo] = useState({ code: null, message: "" });

  useEffect(() => {
    const handleServiceDown = (event) => {
      setErrorInfo({ 
        code: event.detail.code, 
        message: event.detail.message 
      });
    };
    window.addEventListener('service-down', handleServiceDown);
    return () => window.removeEventListener('service-down', handleServiceDown);
  }, []);
  if (errorInfo.code) {
    return <ServiceDown errorCode={errorInfo.code} message={errorInfo.message} />;
  }
  return (
    
    <QueryClientProvider client={queryClient}>
      <div dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
        <Routes>
          <Route 
            path="/" 
            element={!isAuthenticated ? <Login /> : <Navigate to="/main" replace />} 
          />

          {/* المسارات الخاصة بك */}
          <Route 
            path="/department" 
            element={<PermissionGuard requiredPermission="MANAGE_USERS"><CreateDepartment/></PermissionGuard>} 
          />
          <Route 
            path="/department/category" 
            element={<PermissionGuard requiredPermission="MANAGE_USERS"><CreateCategoryToDepartment/></PermissionGuard>} 
          />
          <Route 
            path="/roles" 
            element={<PermissionGuard requiredPermission="MANAGE_USERS"><CreateRole/></PermissionGuard>} 
          />
          <Route 
            path="/employees" 
            element={<PermissionGuard requiredPermission="MANAGE_USERS"><CreateEmployee/></PermissionGuard>} 
          />
          <Route 
            path="/ticketing" 
            element={<PermissionGuard requiredPermission="MANAGE_USERS"><CreateFieldDefinition inSystem={false}/></PermissionGuard>} 
          />
         
          {/* <Route 
            path="/ivrcatalog" 
            element={<PermissionGuard requiredPermission="MANAGE_USERS"><IVRCatalog/></PermissionGuard>} 
          /> */}
          <Route 
            path="/ivr/:flowId" 
            element={<PermissionGuard requiredPermission="MANAGE_USERS"><IVR/></PermissionGuard>} 
          />
          <Route path="/main" element={<Panel/>}>
            <Route index element={<PermissionGuard requiredPermission=""><MainDashboard/></PermissionGuard>} />
            <Route path="calling" element={<AgentTerminal/>} />
            <Route path="workengine" element={<GetAllWorkFlowEngines/>}>
              <Route path="create" element={<CreateWorkFlowRules/>} />
              <Route path="details/:id" element={<WorkFlowDetail/>} />
            </Route>
              <Route path="flow" element={<PermissionGuard requiredPermission=""><AllFlows/></PermissionGuard>} />
            <Route path="system" element={<System/>}>
              {/* <Route index element={<Navigate to="employee" replace />} /> */}
              <Route index element={<Navigate to="stats" replace />} />
              <Route path="stats" element={<SystemStats/>} />
              <Route path="employee" element={<GetAllEmployees/>}>
                <Route path="details/:id" element={<EmployeeDetails/>} />
              </Route>
              
              <Route path="tickets" element={<ShowAllTickets/>}>
                <Route  path="details/:id" element={<TicketDetails/>}  />
                <Route path="structure" element={<BuildTicketStructrue/>}>
                  <Route index element={<Navigate to="createField" replace />} />
                  <Route path="createField" element={<CreateFieldDefinition inSystem={true}/>} />
                  <Route path="allFields" element={<AllFields/>} />
                  <Route path="active" element={<AllActiveFields/>} />
                  <Route path="inactive" element={<AllInActiveFields/>} />
                </Route>
              </Route>
              <Route path="departments" element={<GetAllDepartments/>} />
              <Route path="roles" element={<GetAllRoles/>}>
                
              </Route>
            </Route>
            <Route path="tenants" element={<ShowAllTenants/>}></Route>
            <Route path="performance" element={<AgentsPerformance/>}></Route>
            <Route path="monitory" element={<Monitory/>}></Route>
            <Route path="audit" element={<AuditLogs/>}></Route>
            <Route path="profile" element={<Profile/>} />
          </Route>
        </Routes>
      </div>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
export default App;
















// import React, { useState } from "react";
// import { Navigate, Route, Routes } from "react-router-dom";
// import Modal from "react-modal";

// // Imports
// import Login from "./pages/auth/Login";
// import Panel from "./pages/agent/Panel";
// import Tickets from "./pages/agent/Tickets";
// import Dashboard from "./pages/agent/Dashboard";
// import ShowAllTickets from "./pages/agent/ShowAllTickets";
// import TicketDetails from "./pages/agent/Ticket Details";
// import OutboundCall from "./pages/agent/OutboundCall";
// import Customers from "./pages/agent/Customers";
// import CallRoom from "./pages/agent/CallRoom";
// import AdminPanel from "./pages/admin/AdminPanel";
// import AdminDashboard from "./pages/admin/AdminDashboard";
// import CreateFieldDefinition from "./pages/admin/CreateFieldDefinition";

// import CreateDepartment from "./pages/admin/CreateDepartment";

// Modal.setAppElement("#root");

// function App() {
//   // جلب الـ role من التخزين المحلي (هنا وضعنا قيمة افتراضية للتجربة)
//   const [role] = useState(localStorage.getItem("role"));

//   return (
//     <Routes>
//       {/* صفحة تسجيل الدخول: إذا مسجل دخول، حوله حسب الرتبة */}
//       <Route 
//         path="/" 
//         element={
//           !role ? 
//           <Login />
          
//           : <Navigate to={role === "admin" ? "/admin" : "/main"} replace />
//         } 
//       />

//       {/* 1. مسارات الـ Agent والـ Supervisor (صلاحيات مشتركة أو خاصة) */}
//       {(role === "agent") && (
//         <Route path="/main" element={<Panel/>}>
//           <Route index element={<Dashboard />} />
//           <Route path="callroom" element={<CallRoom />} />
//           <Route path="makecall" element={<OutboundCall />} />
//           <Route path="customers" element={<Customers />} />
          
//           <Route path="tickets" element={<Tickets />}>
//             <Route path="alltickets" element={<ShowAllTickets />}>
//               <Route path="ticketdetails" element={<TicketDetails />} />
//             </Route>
//           </Route>

//           {/* ميزة خاصة فقط بالـ Supervisor داخل لوحة الـ Agent */}
//           {role === "supervisor" && (
//             <Route path="reports" element={<div>تقارير المشرفين</div>} />
//           )}
//         </Route>
//       )}

//       {/* 2. مسارات الـ Admin فقط */}
//       {role === "admin" && (
//        <>
//          <Route path="/admin" element={<CreateFieldDefinition/>}/>
//          <Route path="/department" element={<CreateDepartment/>}/>
//           <Route path="/panel" element={<AdminPanel/>}>
//             <Route index element={<AdminDashboard/>} />
//             <Route path="live"/>
//           </Route>
//        </>
        
//       )}

//       {/* 3. الحماية: إذا حاول أي شخص دخول رابط غير مسموح له */}
//       <Route path="*" element={<Navigate to="/" replace />} />
//     </Routes>
//   );
// }

// export default App;