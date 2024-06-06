'use client'

import { ChangeEvent } from 'react'

interface InputProps {
  id: String
  label?: String
  type?: String | 'text'
  placeholder?: String
  required?: boolean
  value?: any
  disabled?: boolean
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void
}

const Input: React.FC<InputProps> = ({
  id,
  label,
  type,
  placeholder,
  required,
  value,
  disabled,
  onChange,
}) => {
  return (
    <div className="mb-6">
      <label htmlFor={`${id}`} className="block mb-2  text-sm text-gray-500 font-semibold">
        {label}
      </label>
      <input
        type={`${type}`}
        disabled={disabled}
        id={`${id}`}
        value={value}
        name={`${id}`} // Add this line to set the name attribute
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        placeholder={`${placeholder ? placeholder : ''}`}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          if (onChange) {
            onChange(event)
          }
        }}
        required={required ?? false}
      />
    </div>
  )
}

export default Input
