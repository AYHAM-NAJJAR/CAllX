import React from "react";
import { Navigate } from "react-router-dom";

const PermissionGuard = ({ children, requiredPermission }) => {
  const token = localStorage.getItem("Token"); // التحقق من التوكن
  const permissions = JSON.parse(localStorage.getItem("permissions") || "[]");

  // 1. إذا لم يكن هناك توكن، اطرده لصفحة تسجيل الدخول
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // 2. التحقق من الصلاحيات (سواء كانت مفردة أو مصفوفة)
  if (requiredPermission) {
    const hasPermission = Array.isArray(requiredPermission)
      ? requiredPermission.some((perm) => permissions.includes(perm))
      : permissions.includes(requiredPermission);

    if (!hasPermission) {
      return <Navigate to="/main" replace />; // أو صفحة "ليس لديك صلاحية"
    }
  }

  return children;
};

export default PermissionGuard;