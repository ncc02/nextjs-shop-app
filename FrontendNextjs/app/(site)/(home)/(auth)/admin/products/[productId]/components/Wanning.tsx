import React, { useEffect, useRef } from 'react'

interface WarningProps {
  show?: boolean
  title?: string
  subTitle?: string
  handleDelete?: () => void
  onClose: () => void
}

const Warning: React.FC<WarningProps> = ({ show, title, subTitle, onClose, handleDelete }) => {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    // Đăng ký sự kiện click ở cấp cao nhất của ứng dụng
    document.addEventListener('click', handleClickOutside)

    // Hủy đăng ký sự kiện khi component bị unmount
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [onClose])

  return (
    <>
      {show && (
        <div className="fixed top-0 left-0 z-999999 flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-4 py-5">
          <div
            ref={modalRef}
            className="rounded-lg bg-white py-12 px-12 text-center md:py-15 md:px-17.5"
          >
            <span className="mx-auto inline-block">
              <svg
                width="60"
                height="60"
                viewBox="0 0 60 60"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect opacity="0.1" width="60" height="60" rx="30" fill="#DC2626"></rect>
                <path
                  d="M30 27.2498V29.9998V27.2498ZM30 35.4999H30.0134H30ZM20.6914 41H39.3086C41.3778 41 42.6704 38.7078 41.6358 36.8749L32.3272 20.3747C31.2926 18.5418 28.7074 18.5418 27.6728 20.3747L18.3642 36.8749C17.3296 38.7078 18.6222 41 20.6914 41Z"
                  stroke="#DC2626"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </span>
            <h3 className="mt-5.5 pb-2 text-xl font-bold text-black  sm:text-2xl">{title}</h3>
            <p className="mb-10 font-medium text-gray-500">{subTitle}</p>
            <div className="-mx-3 flex flex-wrap gap-y-4">
              <div className="w-full px-3 sm:w-1/2">
                <button
                  className="block w-full rounded border border-stroke bg-slate-100 p-3 text-center font-medium text-black transition hover:border-red-600 hover:bg-red-600 hover:text-white "
                  onClick={onClose}
                >
                  Cancel
                </button>
              </div>
              <div className="w-full px-3 sm:w-1/2">
                <button
                  className="block w-full rounded border border-red-600 bg-red-600 p-3 text-center font-medium text-white transition hover:bg-opacity-90"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Warning
