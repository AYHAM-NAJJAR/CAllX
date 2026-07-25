import React, { useState, useEffect } from 'react';
import { fetchTicketFieldDefinitionById } from '../../services/TicketingStructure/getOneField';
import { useParams, useNavigate } from 'react-router-dom';
import UpdateFieldModal from './Modal/UpdateFieldModal';

function FieldDefinitionDetails() {
  const [field, setField] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { fieldID } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("Token");
  const [isOpenModalUpdateField, setIsOpenModalUpdateField] = useState(false);

  const getFieldDetails = async () => {
    try {
      setLoading(true);
      const data = await fetchTicketFieldDefinitionById(token, fieldID);
      setField(data);
    } catch (err) {
      setError('فشل في جلب بيانات الحقل.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fieldID) {
      getFieldDetails();
    }
  }, [fieldID, token]);

  if (loading) return <div className="p-6 text-white bg-[#111821] min-h-screen flex items-center justify-center">جاري التحميل...</div>;
  if (error) return <div className="p-6 text-red-500 bg-[#111821] min-h-screen flex items-center justify-center">{error}</div>;
  if (!field) return null;

  const renderOptionsValues = (optionsStr) => {
    if (!optionsStr) return <span className="text-gray-500">—</span>;
    try {
      const parsed = JSON.parse(optionsStr);
      if (parsed?.values) {
        return parsed.values.join(", ");
      }
    } catch (e) {
      return optionsStr;
    }
    return optionsStr;
  };

  return (
    <div className="p-8 bg-[#111821] min-h-screen text-white w-full space-y-6">
      
      {/* استدعاء المودل وتمرير الخصائص الصحيحة */}
      <UpdateFieldModal
        data={field} 
        fieldId={fieldID}
        isOpen={isOpenModalUpdateField} 
        onClose={() => setIsOpenModalUpdateField(false)}
        onSuccess={getFieldDetails} 
      />

      <div className="border-b border-gray-800 pb-4 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold uppercase tracking-wider text-white">Field Definition Details</h2>
          <span className="text-xs text-gray-400">Field ID: {field.id}</span>
        </div>
        
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${field.active ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
            {field.active ? 'Active' : 'Inactive'}
          </span>

          <button
            onClick={() => setIsOpenModalUpdateField(true)}
            className="bg-[#0D9EF2] hover:bg-sky-600 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors shadow-lg"
          >
            Update Field
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#151D29]/40 p-5 rounded-2xl border border-gray-800/50 flex flex-col gap-1">
          <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">Field Name</span>
          <span className="text-gray-200 font-medium text-base">{field.fieldName || '—'}</span>
        </div>

        <div className="bg-[#151D29]/40 p-5 rounded-2xl border border-gray-800/50 flex flex-col gap-1">
          <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">Field Label</span>
          <span className="text-gray-200 font-medium text-base">{field.fieldLabel || '—'}</span>
        </div>

        <div className="bg-[#151D29]/40 p-5 rounded-2xl border border-gray-800/50 flex flex-col gap-1">
          <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">Field Type</span>
          <span className="text-[#0D9EF2] font-mono font-semibold text-base">{field.fieldType || '—'}</span>
        </div>

        <div className="bg-[#151D29]/40 p-5 rounded-2xl border border-gray-800/50 flex flex-col gap-1">
          <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">Tenant ID</span>
          <span className="text-gray-200 font-medium text-base">{field.tenantId || '—'}</span>
        </div>

        <div className="bg-[#151D29]/40 p-5 rounded-2xl border border-gray-800/50 flex flex-col gap-1">
          <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">Read Rule</span>
          <span className="text-gray-200 font-medium text-base">{field.readRule || '—'}</span>
        </div>

        <div className="bg-[#151D29]/40 p-5 rounded-2xl border border-gray-800/50 flex flex-col gap-1">
          <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">Write Rule</span>
          <span className="text-gray-200 font-medium text-base">{field.writeRule || '—'}</span>
        </div>

        <div className="bg-[#151D29]/40 p-5 rounded-2xl border border-gray-800/50 flex flex-col gap-1">
          <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">Is Required</span>
          <span className="text-gray-200 font-medium text-base">{field.isRequired ? "Yes" : "No"}</span>
        </div>

        <div className="bg-[#151D29]/40 p-5 rounded-2xl border border-gray-800/50 flex flex-col gap-1">
          <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">Display Order</span>
          <span className="text-gray-200 font-medium text-base">{field.displayOrder ?? '—'}</span>
        </div>

        {field.options && (
          <div className="bg-[#151D29]/40 p-5 rounded-2xl border border-gray-800/50 flex flex-col gap-1 sm:col-span-2 lg:col-span-4">
            <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">Options Values</span>
            <span className="text-gray-200 font-medium text-base">{renderOptionsValues(field.options)}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default FieldDefinitionDetails;