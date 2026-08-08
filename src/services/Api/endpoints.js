export const BASE_URL="https://callx.futxtech.com/api"
export const  SECONDARY_URL="http://153.75.91.83:8080/api"
export const  LIVEKIT_URL="ws://153.75.91.83:7880"




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
export const getone = "/ticket-field-definitions/"
//*  —————————————————————————————————————————— *//
//* TICKETING SYSTEM *//
export const getAllTickets = "/admin/tickets"
export const createticket= "/admin/tickets"
export const getoneticket= "/admin/tickets/"
export const updateticket = "/admin/tickets/"
export const deleteticket = "/admin/tickets/"
export const ticketstats = "/admin/tickets/stats"
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
export const updaterole = "/roles/"
export const deleterole = "/roles/"
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
//* IVR + Node + Audio *//
//! (MENU  + TRANSFER + HANGUP+ VOCEMAIL) NODE !//
export const menuenode= "/ivr/flows/"
export const transfernode= "/ivr/flows/"
export const hangupnode= "/ivr/flows/"
export const voicenode= "/ivr/flows/"
export const updatenode= "/ivr/nodes/"
export const uploadaudio = "/ivr/audio/upload"
export const runaudio = "/ivr/audio/static/tenant_1/" 
//*  —————————————————————————————————————————— *//

//* Tenants Management *//
export const alltenants= "/tenants"
export const createtenant= "/tenants"
export const createadmintenant= "/super-admin/tenant-admins"
export const updatetenant= "/tenants/"

//*  —————————————————————————————————————————— *//
 //* CRM  *//
 //? customers
export const getcustomers = "/v1/crm/customers" 
export const createcustomer = "/v1/crm/customers" 
export const customerprofile = "/v1/crm/customers/" 
export const assigntag= "/v1/crm/customers/"
export const deletecustomer= "/v1/crm/customers/"
export const getagents = "/admin/users/filter"
export const removetag = "/v1/crm/customers/"
export const getonecustomer = "/v1/crm/customers/"
export const updatecustomer = "/v1/crm/customers/"
export const updatecustomernotes = "/v1/crm/customers/"
//? tags
export const createtag = "/v1/crm/tags";
export const tags = "/v1/crm/tags";
export const deletetags="/v1/crm/tags/"
//?campaigns
export const getcampaigns="/v1/crm/campaigns"
export const deletecampaign="/v1/crm/campaigns/"
export const createcampaign ="/v1/crm/campaigns"
export const getonecampaign= "/v1/crm/campaigns/"
export const updatecampaign= "/v1/crm/campaigns/"
//?leads 
export const createlead = "/v1/crm/leads"
export const getleads = "/v1/crm/leads"
export const getonelead="/v1/crm/leads/"
export const updatelead = "/v1/crm/leads/"
export const deletelead = "/v1/crm/leads/"
export const convertlead = "/v1/crm/leads/"
//*  —————————————————————————————————————————— *//

//* —————————————————————————————————————————— *//
//*Integration *//
export const integrationsetting = "/settings"
export const allactive = "/settings/list/active"
//*  —————————————————————————————————————————— *//
//* live stats *//
export const stats = "/stats/live"
export const roomshistory = "/stats/history"
export const summary = "/stats/summary"

//* Calls*/
export const getallcalls = "/calls"
//* *//


//*Queues */
export const createqueue= "/queues"
export const getallqueues= "/queues"
//** */
// ** ENDPOINTS END ** //

