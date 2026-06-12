import { useQuery } from '@tanstack/react-query';
import { allDepartments } from '../services/CompanyStructure/getAllDepartments';

export const useDepartments = (token, isForSelect = false) => {
  return useQuery({
    queryKey: ['departments'], 
    queryFn: () => allDepartments(token), 
    enabled: !!token, 
    select: (response) => {
      const departments = response.departments || [];

      // إذا أرسلنا المتغير true، قم بتحويل البيانات لتناسب react-select
      if (isForSelect) {
        return departments.map((dept) => ({
          value: dept.id,   // القيمة التي ستخزن (Id)
          label: dept.name, // النص الذي سيظهر للمستخدم (Name)
        }));
      }

      // إذا لم نرسله (أو كان false)، أرجع المصفوفة العادية كما هي
      return departments;
    },
  });
};
// 2. هوك جلب التصنيفات بناءً على القسم المختار
export const useDepartmentCategories = (token, selectedDepartmentId, isForSelect = false) => {
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

      // استخراج مصفوفة الـ categories التابعة له، أو إرجاع مصفوفة فارغة لو لم تُوجد
      const categories = currentDept?.categories || [];

      if (isForSelect) {
        // عمل الخريطة على الـ categories نفسها وليس على الـ departments
        return categories.map((cat) => ({
          value: cat.id, // القيمة المستهدفة (مثال: "Hrlevel1")
          label: cat.name, // النص المعروض
        }));
      }
      
      return categories;
    },
  });
};