// components/Input.js
import React from 'react'


function Input({
  id,
  type,
  label,
  placeholder,
  className = '',
  value,
  onChange,
  labelStyle,
  required = false,
  autoFocus,
  ...rest // لدعم خصائص إضافية مثل maxLength, onKeyDown, autoFocus...
}) {
  return (
    <>
      {label && <label className={labelStyle} htmlFor={id}>{label}</label>}
      <input
        required={required}
        className={className}
        id={id}
        autoFocus={autoFocus}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={type !== 'file' ? placeholder : undefined}
        {...rest}
      />
    </>
  )
}

export default Input
