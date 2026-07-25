import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import Button from '../../../components/common/Button';

import { toast } from 'react-toastify';
import { updateFieldDefinition } from '../../../services/TicketingStructure/updateFieldDefinition';


Modal.setAppElement('#root');

const UpdateFieldModal = ({ isOpen, onClose, fieldId, data, onSuccess }) => {
  const FieldType = {
    TEXT: "TEXT",
    NUMBER: "NUMBER",
    DATE: "DATE",
    SELECT: "SELECT",
    USER_REFERENCE: "USER_REFERENCE",
    ENTITY_REFERENCE: "ENTITY_REFERENCE",
    FILE: "FILE",
    MULTI_FILE: "MULTI_FILE"
  };

  const fieldTypes = Object.values(FieldType);
  const checkableFields = [
    { id: "isRequired", label: "Required Field" },
    { id: "customerVisible", label: "Customer Visible" },
    { id: "customerEditable", label: "Customer Editable" },
    { id: "agentOnly", label: "Agent Only" },
    { id: "active", label: "Active" }
  ];

  const [formData, setFormData] = useState({
    fieldName: "",
    fieldLabel: "",
    fieldType: FieldType.TEXT,
    isRequired: true,
    customerVisible: true,
    customerEditable: true,
    agentOnly: false,
    options: [],
    displayOrder: 1,
    active: true
  });

  const token = localStorage.getItem("Token");

  // تعبئة البيانات القديمة عند فتح المودل وتوفر الـ data
  useEffect(() => {
    if (isOpen && data) {
      let parsedOptions = [];
      try {
        if (data.options) {
          const parsed = JSON.parse(data.options);
          parsedOptions = parsed.values || [];
        }
      } catch (e) {
        parsedOptions = [];
      }

      setFormData({
        fieldName: data.fieldName || "",
        fieldLabel: data.fieldLabel || "",
        fieldType: data.fieldType || FieldType.TEXT,
        isRequired: data.isRequired ?? true,
        customerVisible: data.customerVisible ?? true,
        customerEditable: data.customerEditable ?? true,
        agentOnly: data.agentOnly ?? false,
        options: parsedOptions,
        displayOrder: data.displayOrder ?? 1,
        active: data.active ?? true
      });
    }
  }, [isOpen, data]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "fieldType") {
      const isSelect = value === FieldType.SELECT;
      setFormData(prev => ({
        ...prev,
        [name]: value,
        options: isSelect && prev.options.length === 0 ? ["Option 1"] : prev.options
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const updateOption = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const addOption = () => {
    setFormData({ ...formData, options: [...formData.options, ""] });
  };

  const removeOption = (index) => {
    setFormData({
      ...formData,
      options: formData.options.filter((_, i) => i !== index)
    });
  };

  const handleUpdateField = async () => {
    try {
      const payload = {
        fieldName: formData.fieldName.toLowerCase().replace(/\s+/g, "_"),
        fieldLabel: formData.fieldLabel,
        fieldType: formData.fieldType,
        isRequired: formData.isRequired,
        customerVisible: formData.customerVisible,
        customerEditable: formData.customerEditable,
        agentOnly: formData.agentOnly,
        referenceModelName: null,
        referenceFilterQuery: null,
        options:
          formData.fieldType === "SELECT" || formData.fieldType === "RADIO"
            ? JSON.stringify({ values: formData.options })
            : null,
        categoryId: null,
        displayOrder: Number(formData.displayOrder),
        active: formData.active,
        minLength: null,
        maxLength: null,
        minValue: null,
        maxValue: null,
      };

      await updateFieldDefinition(token, fieldId, payload);

      toast.success(`Field updated successfully!`, {
        position: "top-left",
        autoClose: 3000,
        className: '!bg-[#1a2332] !border !border-gray-700 !rounded-xl !shadow-2xl',
      });

      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(`${error.message || "Failed to update field"}`, {
        position: "top-left",
        autoClose: 3000,
        className: '!bg-[#1a2332] !border !border-gray-700 !rounded-xl !shadow-2xl',
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="outline-none max-w-3xl w-full max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl bg-[#1a2332] border border-gray-800"
      overlayClassName="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm p-4 bg-black/60"
    >
      <div className="w-full font-sans text-white">
        <div className="p-6 border-b border-gray-800 flex justify-between items-center sticky top-0 bg-[#1a2332] z-10">
          <div>
            <h2 className="text-white text-xl font-semibold">Update Field Definition</h2>
            <p className="text-gray-400 text-sm">Modify your field parameters</p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white text-lg font-bold px-2 py-1 rounded-lg bg-gray-800/50"
          >
            ✕
          </button>
        </div>

        <div className="p-8 space-y-6">
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Field Name</label>
              <input 
                name="fieldName"
                type="text" 
                value={formData.fieldName}
                onChange={handleInputChange}
                className="w-full bg-[#252f3f] border border-transparent focus:border-blue-500 rounded-md py-3 px-4 text-gray-200 outline-none transition-all"
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Field Label</label>
              <input 
                name="fieldLabel"
                type="text" 
                value={formData.fieldLabel}
                onChange={handleInputChange}
                className="w-full bg-[#252f3f] border border-transparent focus:border-blue-500 rounded-md py-3 px-4 text-gray-200 outline-none transition-all"
              />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Field Type</label>
              <div className="relative">
                <select 
                  name="fieldType"
                  value={formData.fieldType}
                  onChange={handleInputChange}
                  className="w-full bg-[#252f3f] border border-transparent focus:border-blue-500 rounded-md py-3 px-4 text-gray-200 outline-none appearance-none cursor-pointer"
                >
                  {fieldTypes.map(type => (
                    <option key={type} value={type}>
                      {type.replace('_', ' ')}
                    </option>
                  ))}
                </select>
                {/* <img src={drop} className='w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none' alt="" /> */}
              </div>
            </div>
          </div>

          {formData.fieldType === FieldType.SELECT && (
            <div className="bg-[#161d29] rounded-lg p-6 border border-gray-800/50">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Dropdown Options</span>
                <button type="button" onClick={addOption} className="text-blue-400 hover:text-blue-300 text-xs font-semibold">+ Add Option</button>
              </div>
              <div className="space-y-3">
                {formData.options.map((opt, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <span className="w-8 h-8 flex items-center justify-center bg-[#252f3f] text-gray-500 rounded text-xs">{index + 1}</span>
                    <input 
                      type="text" 
                      value={opt}
                      onChange={(e) => updateOption(index, e.target.value)}
                      placeholder="Enter option label"
                      className="flex-1 bg-[#252f3f] border border-transparent rounded-md py-2 px-4 text-gray-300 text-sm outline-none focus:border-gray-600"
                    />
                    <button type="button" onClick={() => removeOption(index)} className="text-gray-500 hover:text-red-400 transition-colors">🗑</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-12">
            {checkableFields.map(item => (
              <div key={item.id} className="flex items-center justify-between border-b border-gray-800/50 pb-2">
                <span className="text-gray-300 text-sm">{item.label}</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    name={item.id}
                    checked={formData[item.id]}
                    onChange={handleInputChange}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4 border-t border-gray-800 pt-6">
            <span className="text-[10px] font-bold text-gray-400 uppercase">Display Order</span>
            <input 
              name="displayOrder"
              type="number" 
              value={formData.displayOrder}
              onChange={handleInputChange}
              className="w-20 bg-[#252f3f] rounded-md py-2 px-3 text-center text-gray-200 outline-none border border-transparent focus:border-blue-500"
            />
          </div>
        </div>

        <div className="p-6 bg-[#1a2332] border-t border-gray-800 flex justify-end gap-4 rounded-b-xl sticky bottom-0 z-10">
          <button 
            type="button"
            onClick={onClose}
            className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2.5 rounded font-semibold transition-all"
          >
            Cancel
          </button>
          <Button 
            onClick={handleUpdateField}
            className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-2.5 rounded font-semibold shadow-lg shadow-blue-900/20 transition-all active:scale-95"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default UpdateFieldModal;