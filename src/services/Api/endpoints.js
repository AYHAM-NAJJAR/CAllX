export const BASE_URL="https://callx.futxtech.com/api"

export const  SECONDARY_URL="http://153.75.91.83:8080/api"




// ** ENDPOINTS START ** //

//* Auth *//
export const  login= "/auth/login"
//*  —————————————————————————————————————————— *//
//* Dashboard *//
export const livestats= "/stats/live"
//*  —————————————————————————————————————————— *//
//* TICKETING STRUCTURE *//
export const fieldDifenition = "/ticket-field-definitions"
export const getallActiveFields = "/ticket-field-definitions"
export const getallFields = "/ticket-field-definitions/list/all"
export const getallInActiveFields = "/ticket-field-definitions/list/inactive"
export const disable = "/ticket-field-definitions/"
export const activate = "/ticket-field-definitions/"
//*  —————————————————————————————————————————— *//
//* TICKETING SYSTEM *//
export const getAllTickets = "/admin/tickets"
export const createticket= "/tickets"
export const getoneticket= "/admin/tickets/"
export const updateticket = "/admin/tickets/"
export const deleteticket = "/admin/tickets/"
//*  —————————————————————————————————————————— *//
//* Company Structure *//
export const createDepartment = "/structure/departments"
export const getAllDepartments = "/structure/departments"
export const createCategory = "/structure/departments/"
//*  —————————————————————————————————————————— *//
 //* Role&Permission *//
export const createRole= "/roles"
export const allRoles= "/roles"
export const getAllPermissions = "/roles/permissions"
//*  —————————————————————————————————————————— *//
//* User management  *//
export const createuser= "/admin/users"
export const getEmps= "/admin/users"
//getone + delete +update
export const getEmp= "/admin/users/"
//*  —————————————————————————————————————————— *//
//*Analytics & Reports *//
export const  csv = "/admin/analytics/export/csv"
export const  pdf = "/admin/analytics/export/pdf"
export const  agentsmetrics = "/admin/analytics/agents-performance"
export const  systemstats = "/admin/analytics/stats"
//*  —————————————————————————————————————————— *//
//* Monitoring  *//
export const  monitorysystemstats = "/admin/monitoring/stats"
export const  performancemetrics = "/admin/monitoring/performance"
export const auditing = "/admin/monitoring/recent-activity"
//*  —————————————————————————————————————————— *//
//* WorkflowRule *//
export const rule = "/admin/workflows"
export const onerule = "/admin/workflows/"
//*  —————————————————————————————————————————— *//
//* Flow *//
export const createflow= "/ivr/flows"
export const getflows= "/ivr/flows"
export const updateflow= "/ivr/flows/"
export const deleteflow = "/ivr/flows/"
//*  —————————————————————————————————————————— *//
//* IVR + Node *//
//! (MENU  + TRANSFER + HANGUP+ VOCEMAIL) NODE !//
export const menuenode= "/ivr/flows/"
export const transfernode= "/ivr/flows/"
export const hangupnode= "/ivr/flows/"
export const voicenode= "/ivr/flows/"
export const updatenode= "/ivr/nodes/"
//*  —————————————————————————————————————————— *//

//* Tenants Management *//
export const alltenants= "/tenants"
export const createtenant= "/tenants"
export const updatetenant= "/tenants/"

//*  —————————————————————————————————————————— *//
// ** ENDPOINTS END ** //

