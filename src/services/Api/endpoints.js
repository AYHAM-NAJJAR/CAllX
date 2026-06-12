export const BASE_URL="https://callx.futxtech.com/api"

export const  login= "/auth/login"


// ** ENDPOINTS START ** //
//* Dashboard *//

export const livestats= "/stats/live"

//* TICKETING STRUCTURE *//
export const fieldDifenition = "/ticket-field-definitions"
export const getallActiveFields = "/ticket-field-definitions"
export const getallFields = "/ticket-field-definitions/list/all"
export const getallInActiveFields = "/ticket-field-definitions/list/inactive"
export const disable = "/ticket-field-definitions/"
export const activate = "/ticket-field-definitions/"

//* TICKETING SYSTEM *//
export const getAllTickets = "/admin/tickets"
export const createticket= "/tickets"

//* Company Structure *//
export const createDepartment = "/structure/departments"
export const getAllDepartments = "/structure/departments"
export const createCategory = "/structure/departments/"

 //* Role&Permission *//
export const createRole= "/roles"
export const allRoles= "/roles"
export const getAllPermissions = "/roles/permissions"

//* User management  *//
export const createuser= "/admin/users"
export const getEmps= "/admin/users"
//getone + delete +update
export const getEmp= "/admin/users/"

//*Analytics & Reports *//
export const  csv = "/admin/analytics/export/csv"


//* WorkflowRule *//
export const rule = "/admin/workflows"
export const onerule = "/admin/workflows/"

// ** ENDPOINTS END ** //

