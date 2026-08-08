import { useQuery } from '@tanstack/react-query';
import { allDepartments } from '../services/CompanyStructure/getAllDepartments';

// 1. هوك جلب الأقسام مع دعم البحث المحلي
export const useDepartments = (token, isForSelect = false, search = "") => {
  return useQuery({
    queryKey: ['departments'], 
    queryFn: () => allDepartments(token), 
    enabled: !!token, 
    select: (response) => {
      const departments = response.departments || [];

      // 👈 منطق البحث المحلي في الأقسام (يدعم العربية والإنجليزية في كل حقول القسم)
      const filteredDepartments = departments.filter((dept) => {
        if (!search || search.trim() === "") return true;
        const query = search.trim().toLowerCase();
        return Object.values(dept).some((value) => {
          if (value === null || value === undefined) return false;
          return String(value).toLowerCase().includes(query);
        });
      });

      // إذا أرسلنا المتغير true، قم بتحويل البيانات لتناسب react-select
      if (isForSelect) {
        return filteredDepartments.map((dept) => ({
          value: dept.id,   // القيمة التي ستخزن (Id)
          label: dept.name, // النص الذي سيظهر للمستخدم (Name)
        }));
      }

      // إذا لم نرسله (أو كان false)، أرجع المصفوفة المصفاة كما هي
      return filteredDepartments;
    },
  });
};

// 2. هوك جلب التصنيفات بناءً على القسم المختار مع دعم البحث المحلي
export const useDepartmentCategories = (token, selectedDepartmentId, isForSelect = false, search = "") => {
  return useQuery({
    queryKey: ['departments'], // نفس الكي لضمان الكاش
    queryFn: () => allDepartments(token),
    enabled: !!token && !!selectedDepartmentId, // لا يشتغل الكويري إلا إذا تم اختيار قسم فعلياً
    select: (response) => {
      const departments = response?.data || response?.departments || [];
      
      // البحث عن القسم المختار حالياً
      const currentDept = departments.find(
        (dept) => String(dept.id) === String(selectedDepartmentId)
      );

      // استخراج مصفوفة الـ categories التابعة له
      const categories = currentDept?.categories || [];

      // 👈 منطق البحث المحلي في التصنيفات التابعة للقسم
      const filteredCategories = categories.filter((cat) => {
        if (!search || search.trim() === "") return true;
        const query = search.trim().toLowerCase();
        return Object.values(cat).some((value) => {
          if (value === null || value === undefined) return false;
          return String(value).toLowerCase().includes(query);
        });
      });

      if (isForSelect) {
        // عمل الخريطة على الـ filteredCategories المصفاة
        return filteredCategories.map((cat) => ({
          value: cat.id, // القيمة المستهدفة
          label: cat.name, // النص المعروض
        }));
      }
      
      return filteredCategories;
    },
  });
};