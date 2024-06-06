'use client'

import { Dialog, Transition } from '@headlessui/react'
import React, { Fragment, memo } from 'react'
import { IoClose } from 'react-icons/io5'
import Image from 'next/image'
import useImage from '../../hooks/useImage'
import { useCallback } from 'react'

const ImageModal = () => {
  const { url, setUrl } = useImage()
  const onClose = useCallback(() => {
    setUrl()
  }, [setUrl])

  if (!url) return null

  return (
    <Transition.Root show={!!url} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className="
              fixed
              inset-0
              bg-gray-500
              bg-opacity-75
              transition-opacity
          "
          />
        </Transition.Child>
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center text-center p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel
                className="
                  relative
                  transform
                  overflow-hidden
                  rounded-lg
                  px-4
                  pb-4
                  text-left
                  transition-all
                  my-8
                  p-6
              "
              >
                <div
                  className="
                  absolute
                  right-0
                  top-0
                  block  
                  pr-4
                  pt-4
                  z-10
              "
                >
                  <button
                    className="
                      rounded-md
                      bg-white
                      text-gray-400
                      hover:text-gray-500
                      focus:outline-none
                      focus:ring-2
                      focus:ring-sky-500
                      focus:ring-offset-2  
                "
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <IoClose className="h-6 w-6" />
                  </button>
                </div>
                <div className="h-[80vh] w-[80vw]">
                  <Image alt="Image" className="object-scale-down" fill src={url} />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default ImageModal
