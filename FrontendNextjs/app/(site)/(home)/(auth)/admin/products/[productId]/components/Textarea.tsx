// 'use client'

import clsx from 'clsx'
import React from 'react'

interface TextareaProps {
  id: string
  label?: string
  type?: string | 'text'
  placeholder?: string
  required?: boolean
  value?: any;
  disabled?: boolean;
  onChange?: (event: any) => void
  className?: string
}

const Textarea: React.FC<TextareaProps> = ({
  id,
  label,
  className,
  type,
  value,
  placeholder,
  required,
  disabled,
  onChange,
}) => {
  return (
    <div className={clsx('mb-6 h-full', className)}>
      <label
        htmlFor={id}
        className="block mb-2 text-sm text-gray-500 font-semibold"
      >
        {label}
      </label>
      <textarea
        id={`${id}`}
        name={`${id}`}
        value={value}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        placeholder={placeholder || ''}
        disabled={disabled}
        onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
          if (onChange) {
            onChange(event)
          }
        }}
        required={required || false}
      />
    </div>
  )
}

export default Textarea
