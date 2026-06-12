import React from 'react';
import Select from 'react-select';
import { useTranslation } from 'react-i18next';

const LanguageSelect = ({ show = true }) => {
  const { i18n } = useTranslation();

  if (!show) return null;

  const options = [
    { value: 'en', label: 'English' },
    { value: 'ar', label: 'العربية' }
  ];

  const changeLanguage = (selectedOption) => {
    i18n.changeLanguage(selectedOption.value);
  };

  const currentOption = options.find(option => option.value === i18n.language);

  const customStyles = {
    control: (base) => ({
      ...base,
      backgroundColor: 'transparent',
      border: 'none',
      boxShadow: 'none',
      cursor: 'pointer',
      width: '100px',
      minHeight: '30px'
    }),
    singleValue: (base) => ({ ...base, color: '#9CA3AF', fontSize: '14px', fontWeight: '600' }),
    menu: (base) => ({
      ...base,
      backgroundColor: '#151D29',
      border: '1px solid #1f2937',
      borderRadius: '8px'
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? '#1a2332' : '#151D29',
      color: state.isFocused ? '#ffffff' : '#9CA3AF',
      cursor: 'pointer',
      padding: '8px 12px'
    }),
    dropdownIndicator: (base) => ({ ...base, color: '#9CA3AF', padding: '0 4px' }),
    indicatorSeparator: () => ({ display: 'none' })
  };

  return (
    <Select
      value={currentOption}
      onChange={changeLanguage}
      options={options}
      isSearchable={false}
      styles={customStyles}
    />
  );
};

export default LanguageSelect;