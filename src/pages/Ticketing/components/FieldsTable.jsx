import React from "react";
import { useLocation } from "react-router-dom"; 
import Button from "../../../components/common/Button";
import { SoftDeleteField } from "../../../services/TicketingStructure/SoftDeleteField";
import { toast } from "react-toastify";
import { ActivateField } from "../../../services/TicketingStructure/ActivateField";

const FieldsTable = ({ fields }) => {
  const token = localStorage.getItem("Token");
  const location = useLocation(); 

  // التحقق من أن المسار يحتوي على active وليس inactive من خلال النفي
  const isActiveFieldsPage = location.pathname.includes("active") && !location.pathname.includes("inactive");
  
  // التحقق من الحقول غير النشطة
  const isInactiveFieldsPage = location.pathname.includes("inactive");
  
  // التحقق من كل الحقول
  const isAllFieldsPage = location.pathname.includes("allFields");
  const renderOptions = (optionsStr, fieldType) => {
    if (!optionsStr || fieldType !== "SELECT") {
      return <span className="text-gray-500 text-xs">—</span>;
    }

    try {
      const parsed = JSON.parse(optionsStr);

      if (parsed?.values) {
        return parsed.values.map((val, idx) => (
          <span
            key={idx}
            className="bg-[#0D9EF2]/10 text-[#0D9EF2] px-3 py-1 rounded-lg text-xs font-semibold border border-[#0D9EF2]/20"
          >
            {val}
          </span>
        ));
      }
    } catch (e) {
      console.error("Error parsing options:", e);
    }

    return <span className="text-red-400 text-sm font-medium">Data Error</span>;
  };

  async function Disable(id) {
    const response = await SoftDeleteField(id, token);
    if (response.success) {
      toast.success(response.message, {
        position: "top-left",
        autoClose: 3000,
        className: '!bg-[#1a2332] !border !border-gray-700 !rounded-xl !shadow-2xl',
      });
    }
  }

  async function Activate(id) {
    const response = await ActivateField(id, token);
    if (response.success) {
      toast.success(response.message, {
        position: "top-left",
        autoClose: 3000,
        className: '!bg-[#1a2332] !border !border-gray-700 !rounded-xl !shadow-2xl',
      });
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-[#101B22] shadow-lg">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-[#0F172A] border-b border-slate-800">
              <th className="px-5 py-4 text-left text-xs font-bold tracking-wider text-slate-300 uppercase">
                Field Name
              </th>
              <th className="px-5 py-4 text-left text-xs font-bold tracking-wider text-slate-300 uppercase">
                Field Label
              </th>
              <th className="px-5 py-4 text-left text-xs font-bold tracking-wider text-slate-300 uppercase">
                Type
              </th>
              <th className="px-5 py-4 text-center text-xs font-bold tracking-wider text-slate-300 uppercase">
                Required
              </th>
              <th className="px-5 py-4 text-center text-xs font-bold tracking-wider text-slate-300 uppercase">
                Visible
              </th>
              <th className="px-5 py-4 text-center text-xs font-bold tracking-wider text-slate-300 uppercase">
                Editable
              </th>
              <th className="px-5 py-4 text-left text-xs font-bold tracking-wider text-slate-300 uppercase">
                Options
              </th>
              {/* تظهر فقط إذا لم نكن في صفحة كل الحقول */}
              {!isAllFieldsPage && (
                <th className="px-5 py-4 text-left text-xs font-bold tracking-wider text-slate-300 uppercase">
                  Action
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            {fields.map((field) => (
              <tr
                key={field.id}
                className="border-b border-slate-800 hover:bg-[#0F172A]/60 transition-all duration-200"
              >
                <td className="px-5 py-4">
                  <span className="font-semibold text-white">{field.fieldName}</span>
                </td>
                <td className="px-5 py-4 text-slate-300">{field.fieldLabel}</td>
                <td className="px-5 py-4">
                  <span className="bg-[#0F172A] border border-slate-700 text-[#0D9EF2] px-3 py-1 rounded-lg text-xs font-mono">
                    {field.fieldType}
                  </span>
                </td>
                <td className="px-5 py-4 text-center text-lg">
                  {field.isRequired ? "✅" : "❌"}
                </td>
                <td className="px-5 py-4 text-center text-lg">
                  {field.customerVisible ? "✅" : "❌"}
                </td>
                <td className="px-5 py-4 text-center text-lg">
                  {field.customerEditable ? "✅" : "❌"}
                </td>
                <td className="px-5 py-4">
                  <div className="flex flex-wrap gap-2">
                    {renderOptions(field.options, field.fieldType)}
                  </div>
                </td>
                
                {/* تظهر الأزرار فقط إذا لم نكن في صفحة كل الحقول */}
                {!isAllFieldsPage && (
                  <td className="px-5 py-4">
                    <div className="flex flex-row gap-2">
                      {/* تظهر فقط في الحقول غير النشطة */}
                      {isInactiveFieldsPage && (
                        <Button
                          onClick={() => Activate(field.id)}
                          className="flex-1 bg-customButton hover:bg-sky-700 text-white text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors"
                        >
                          Activate
                        </Button>
                      )}

                      {/* تظهر فقط في الحقول النشطة */}
                      {isActiveFieldsPage && (
                        <Button
                          onClick={() => Disable(field.id)}
                          className="flex-1 bg-red-500 hover:bg-red-700 text-white text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors"
                        >
                          Disable
                        </Button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FieldsTable;