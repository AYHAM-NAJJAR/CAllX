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
import CallDashboard from "./pages/Calling/FloatingAgentTerminal";
import CreateWorkFlowRules from "./pages/workflowEngine/CreateWorkFlowRules";
import GetAllWorkFlowEngines from "./pages/workflowEngine/GetAllWorkFlowEngines";
import WorkFlowDetail from "./pages/workflowEngine/WorkFlowDetail";
import AgentTerminal from "./pages/Calling/FloatingAgentTerminal";
import MainPerformance from "./pages/performance/AgentsPerformance";
import SystemStats from "./pages/dashboard/SystemStats";
import TicketDetails from "./pages/Ticketing/Ticket Details";
import AllFlows from "./pages/Calling/IVR/AllFlows";
import AgentsPerformance from "./pages/performance/AgentsPerformance";
import Monitory from "./pages/monitoring/Monitory";
import AuditLogs from "./pages/monitoring/AuditLogs";
import ShowAllTenants from "./pages/Tenants/ShowAllTenants";
import MakeCall from "./pages/Calling/MakeCall";


import CustomerDetails from "./pages/Crm/customers/CustomerDetails";
import GetAllTags from "./pages/Crm/Tags/GetAllTags";
import ShowAllCampaigns from "./pages/Crm/Campaigns/ShowAllCampaigns";
import Documentation from "./pages/Documentation/Documentation";
import ShowAllCustomers from "./pages/Crm/customers/ShowAllCustomers";
import GetLeads from "./pages/Crm/leads/GetLeads";
import CallRoom from "./pages/Calling/CallRoom";
import FieldDefinitionDetails from "./pages/Ticketing/FieldDefinitionDetails";
import Integration from "./pages/Integrations/Integration";
import ShowAllSettings from "./pages/Integrations/ShowAllSettings";
import CallSYS from "./pages/Calling/CallSYS";
import StickyNotesManager from "./components/common/StickyNotesManager";
import GetAllCalls from "./pages/Calling/GetAllCalls";
import GetCallDetails from "./pages/Calling/GetCallDetails";
import CreateQueue from "./pages/Queues/CreateQueue";
import GetAllQueus from "./pages/Queues/GetAllQueus";
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
        <StickyNotesManager />
        <Routes>
          <Route 
            path="/" 
            element={!isAuthenticated ? <Login /> : <Navigate to="/main" replace />} 
          />

          {/* المسارات الخاصة بك */}
          <Route 
            path="/department" 
            element={<PermissionGuard requiredPermission="MANAGE_COMPANY_STRUCTURE"><CreateDepartment/></PermissionGuard>} 
          />
          <Route 
            path="/department/category" 
            element={<PermissionGuard requiredPermission="MANAGE_COMPANY_STRUCTURE"><CreateCategoryToDepartment/></PermissionGuard>} 
          />
          <Route 
            path="/roles" 
            element={<PermissionGuard requiredPermission="MANAGE_ROLES"><CreateRole/></PermissionGuard>} 
          />
          <Route 
            path="/employees" 
            element={<PermissionGuard requiredPermission="MANAGE_USERS"><CreateEmployee/></PermissionGuard>} 
          />
          <Route 
            path="/ticketing" 
            element={<PermissionGuard requiredPermission="MANAGE_FIELD_DEFINITIONS"><CreateFieldDefinition inSystem={false}/></PermissionGuard>} 
          />
         
          {/* <Route 
            path="/ivrcatalog" 
            element={<PermissionGuard requiredPermission="MANAGE_USERS"><IVRCatalog/></PermissionGuard>} 
          /> */}
          <Route 
            path="/ivr/:flowId" 
            element={<PermissionGuard requiredPermission="MANAGE_WORKFLOWS"><IVR/></PermissionGuard>} 
          />
          <Route path="/main" element={<Panel/>}>
            <Route index element={<CallSYS/>} />
            <Route path="calls" element={<GetAllCalls/>}>
            <Route path="details/:cid" element={<GetCallDetails/>} />
            </Route>
            <Route path="queue" element={<CreateQueue/>} >
              <Route path="all" element={<GetAllQueus/>} />
            </Route>
            
            <Route path="call-room" element={<CallRoom/>} />
            <Route path="calling/makecall" element={<MakeCall/>} />
            <Route path="workengine" element={<PermissionGuard requiredPermission={["VIEW_WORKFLOWS", "MANAGE_WORKFLOWS"]}><GetAllWorkFlowEngines/></PermissionGuard>}>
              <Route path="create" element={<PermissionGuard requiredPermission="MANAGE_WORKFLOWS"><CreateWorkFlowRules/></PermissionGuard>} />
              <Route path="details/:id" element={<PermissionGuard requiredPermission="VIEW_WORKFLOWS"><WorkFlowDetail/></PermissionGuard>} />
            </Route>
              <Route path="flow"  element={<PermissionGuard requiredPermission="MANAGE_WORKFLOWS"><AllFlows/></PermissionGuard>}  />
            <Route path="system" element={<System/>}>
              {/* <Route index element={<Navigate to="employee" replace />} /> */}
              <Route index element={<Navigate to="stats" replace />} />
              <Route path="stats" element={<PermissionGuard requiredPermission={["VIEW_ANALYTICS", "VIEW_MONITORING"]}><SystemStats/></PermissionGuard>} />
              <Route path="employee" element={<PermissionGuard requiredPermission="MANAGE_USERS"><GetAllEmployees/></PermissionGuard>}>
                <Route path="details/:id" element={<EmployeeDetails/>} />
              </Route>
              
              <Route path="tickets" element={<PermissionGuard requiredPermission={["VIEW_ALL_TICKETS", "VIEW_OWN_TICKETS", "VIEW_ASSIGNED_TICKETS"]}><ShowAllTickets/></PermissionGuard> }>
                <Route  path="details/:id" element={<TicketDetails/>}  />
                <Route path="structure" element={<PermissionGuard requiredPermission={["MANAGE_FIELD_DEFINITIONS", "VIEW_FIELD_DEFINITIONS"]}><BuildTicketStructrue/></PermissionGuard>}>
                  <Route index element={<Navigate to="createField" replace />} />
                  <Route path="createField" element={<PermissionGuard requiredPermission="MANAGE_FIELD_DEFINITIONS"><CreateFieldDefinition inSystem={true}/></PermissionGuard>} />
                  <Route path="single/:fieldID" element={<PermissionGuard requiredPermission="VIEW_FIELD_DEFINITIONS"><FieldDefinitionDetails/></PermissionGuard>} />
                  <Route path="allFields" element={<PermissionGuard requiredPermission="VIEW_FIELD_DEFINITIONS"><AllFields/></PermissionGuard>} />
                  <Route path="active" element={<PermissionGuard requiredPermission="VIEW_FIELD_DEFINITIONS"><AllActiveFields/></PermissionGuard>} />
                  <Route path="inactive" element={<PermissionGuard requiredPermission="VIEW_FIELD_DEFINITIONS"><AllInActiveFields/></PermissionGuard>} />
                </Route>
              </Route>
              <Route path="departments" element={<PermissionGuard requiredPermission={["VIEW_COMPANY_STRUCTURE", "MANAGE_COMPANY_STRUCTURE"]}><GetAllDepartments/></PermissionGuard>} />
              <Route path="roles" element={<PermissionGuard requiredPermission="MANAGE_ROLES"><GetAllRoles/></PermissionGuard>}>
                
              </Route>
            </Route>
            <Route path="tenants" element={<PermissionGuard requiredPermission={["VIEW_TENANTS", "MANAGE_TENANT_STATUS", "CREATE_TENANT"]}><ShowAllTenants/></PermissionGuard>}></Route>
            <Route path="performance" element={<PermissionGuard requiredPermission={["VIEW_ANALYTICS", "VIEW_MONITORING"]}><AgentsPerformance/></PermissionGuard>}></Route>
            <Route path="monitory" element={<PermissionGuard requiredPermission="VIEW_MONITORING"><Monitory/></PermissionGuard>}></Route>
            <Route path="audit" element={<PermissionGuard requiredPermission="VIEW_AUDIT_LOGS"><AuditLogs/></PermissionGuard>}></Route>
            <Route path="customers" element={<ShowAllCustomers/>}>
              <Route path="details/:id" element={<CustomerDetails/>} />
              <Route path="tags" element={<GetAllTags/>} />
            </Route>
             <Route path="campaigns" element={<ShowAllCampaigns/>}/>
             <Route path="leads" element={<GetLeads/>}/>
             <Route path="profile" element={<Profile/>} />
             <Route path="integration" element={<Integration/>} >
              <Route path="all" element={<ShowAllSettings/>} />
             </Route>
             <Route path="doc" element={<Documentation/>} />
          </Route>
        </Routes>
      </div>
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  
  );
}
export default App;