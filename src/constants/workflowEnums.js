// 1. حقول التذكرة الأساسية
export const CoreField = Object.freeze({
  STATUS: 'STATUS',
  PRIORITY: 'PRIORITY',
  TITLE: 'TITLE',
  DESCRIPTION: 'DESCRIPTION',
  ESCALATED: 'ESCALATED',
  DEPARTMENT: 'DEPARTMENT',
  CURRENT_OWNER: 'CURRENT_OWNER',
});

// 2. أدوات المقارنة للشروط
export const Operator = Object.freeze({
  EQUALS: 'EQUALS',
  NOT_EQUALS: 'NOT_EQUALS',
  GREATER_THAN: 'GREATER_THAN',
  GREATER_THAN_OR_EQUAL: 'GREATER_THAN_OR_EQUAL',
  LESS_THAN: 'LESS_THAN',
  LESS_THAN_OR_EQUAL: 'LESS_THAN_OR_EQUAL',
  CONTAINS: 'CONTAINS',
  IS_EMPTY: 'IS_EMPTY',
  IS_NOT_EMPTY: 'IS_NOT_EMPTY',
});

// 3. درجات الأولوية
export const TicketPriority = Object.freeze({
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL',
});
export const TicketStatus = Object.freeze({
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  PENDING: 'PENDING',
  RESOLVED: 'RESOLVED',
  CLOSED: 'CLOSED',
});
// 4. أنواع الإجراءات
export const WorkflowActionType = Object.freeze({
  SET_FIELD_VALUE: 'SET_FIELD_VALUE',
  ASSIGN_DEPARTMENT: 'ASSIGN_DEPARTMENT',
  ASSIGN_AGENT: 'ASSIGN_AGENT',
});

