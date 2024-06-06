'use client'

import { useState } from 'react'

interface SearchBarProps {
  name?: String
  placeholder?: String
  value?: String
  disabled?: boolean
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const SearchBar: React.FC<SearchBarProps> = ({ name, placeholder, value, disabled, onChange }) => {
  const [timerId, setTimerId] = useState<NodeJS.Timeout>()

  const onChangeText = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (timerId) clearTimeout(timerId)
    setTimerId(
      setTimeout(() => {
        if (onChange) onChange(e)
      }, 300),
    )
  }

  return (
    <div className="relative">
      <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
        <svg
          className="w-4 h-4 text-gray-500 "
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 20 20"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
          />
        </svg>
      </div>
      <input
        type="search"
        disabled={disabled}
        defaultValue={value?.toString()}
        className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
        placeholder={`${placeholder ? placeholder : ''}`}
        onChange={onChangeText}
        required
      />
    </div>
  )
}

export default SearchBar
