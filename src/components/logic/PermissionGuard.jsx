import React from "react";
import { Navigate } from "react-router-dom";

const PermissionGuard = ({ children, requiredPermission }) => {
  const token = localStorage.getItem("Token"); // التحقق من التوكن
  const permissions = JSON.parse(localStorage.getItem("permissions") || "[]");

  // 1. إذا لم يكن هناك توكن، اطرده لصفحة تسجيل الدخول
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // 2. إذا كان هناك توكن ولكن لا يملك الصلاحية المطلوبة
  if (requiredPermission && !permissions.includes(requiredPermission)) {
    return <Navigate to="/main" replace />; // أو صفحة "ليس لديك صلاحية"
  }

  return children;
};

export default PermissionGuard;