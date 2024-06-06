'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import Input from '../../components/Input'
import useLoading from '@/app/hooks/useLoading'
import axios, { AxiosError } from 'axios'
import toast from 'react-hot-toast'
import Textarea from '../../components/Textarea'
import { IoTrash } from 'react-icons/io5'
import { Category } from '@prisma/client'
import Warning from './Warning'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface FormData {
  name: string
  image: string
  description: string
}

const CategoryForm = ({ category }: { category: Category }) => {
  const { loading, unLoading } = useLoading()
  const [variant, setVariant] = useState<'View' | 'Update'>('View')
  const [delOpen, setDelOpen] = useState(false)
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    name: category.name,
    image: category.image,
    description: category.description || '',
  })

  const handleUpload = useCallback(
    async (file: any) => {
      if (!file) return
      const url = 'https://api.cloudinary.com/v1_1/johnpaul/image/upload'
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', 'dryqolej')
      loading()
      try {
        const res = await axios.post(url, formData)

        setFormData(prev => ({ ...prev, image: res.data.secure_url }))
      } catch (error) {
        console.error('Error:', error)
      }
      unLoading()
    },
    [loading, unLoading],
  )
  const onDrop = useCallback(
    (acceptedFiles: any) => {
      let file = Object.assign(acceptedFiles[0], {
        preview: URL.createObjectURL(acceptedFiles[0]),
      })
      handleUpload(file)
    },
    [handleUpload],
  )
  const { getRootProps, getInputProps } = useDropzone({ onDrop })

  const handleInputChange = (event: any) => {
    const { name, value } = event.target // Check if event.target is defined
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleSubmit = async () => {
    loading()
    try {
      const res = await axios.put(`/api/categories/${category.id}`, {
        data: formData,
      })
      if (res.data.success) {
        toast.success(res.data.message)
        router.push(`/admin/categories/${res.data.data.category.id}`)
      } else {
        toast.error(res.data.error.message)
      }
    } catch (error) {
      console.log(error)
      const err = error as AxiosError<{ error: { message: string } }>
      toast.error(err.response?.data?.error?.message || err.message || 'Something went wrong')
    }
    unLoading()
  }
  const handleDelete = async () => {
    loading()
    setDelOpen(false)
    try {
      const res = await axios.delete(`/api/categories/${category.id}`)
      if (res.data.success) {
        toast.success(res.data.message)
        router.push('/admin/categories/add')
      } else {
        toast.error(res.data.error.message)
      }
    } catch (error) {
      console.log(error)
      toast.error('Cannot delete this product \n Try to change this product to Inactive')
    }
    unLoading()
  }
  return (
    <>
      <Warning
        title="Delete Category"
        subTitle="Are you sure you want to delete this category?"
        show={delOpen}
        handleDelete={handleDelete}
        onClose={() => setDelOpen(false)}
      />
      <div className="p-2 flex justify-between items-end">
        <h1 className="text-xl text-gray-500 font-semibold ">Product Detail</h1>
        <div className="pt-3">
          <button
            type="submit"
            className={
              'ml-2 text-white bg-blue-700 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center '
            }
            onClick={() => setVariant(variant === 'View' ? 'Update' : 'View')}
          >
            {variant === 'View' ? 'Update' : 'View'}
          </button>
          <button
            type="submit"
            className={
              'ml-2 text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center'
            }
            onClick={() => setDelOpen(true)}
          >
            Delete
          </button>
        </div>
      </div>
      <div className="min-h-[60vh]">
        <div className="flex flex-wrap ">
          <div className="xl:w-1/2 w-full mb-3">
            <div className="m-2 h-full">
              <div className="border rounded-lg h-full">
                <div className="m-4">
                  <div className="mb-2">
                    <h3 className="block text-sm  text-gray-500 font-semibold ">
                      {variant === 'Update' ? variant : ''} Image
                    </h3>
                  </div>
                  {formData.image && (
                    <div className="grid grid-cols-1 gap-x-2">
                      <div className="flex items-center mb-2 border border-gray-300  rounded-lg p-2">
                        <div className="flex justify-between items-center w-full">
                          <div className=" flex items-center">
                            <div className="h-16 w-16 overflow-hidden mr-3 rounded-lg">
                              <Image
                                width={'100'}
                                height={'100'}
                                className="h-full w-auto"
                                src={formData.image}
                                alt=""
                              />
                            </div>
                            <div className="hidden sm:flex flex-col text-gray-500 "></div>
                          </div>
                          {variant === 'Update' && (
                            <div className="px-3 py-3 text-2xl rounded-3xl text-gray-600 hover:text-red-600 hover:text-3xl">
                              <div onClick={() => setFormData({ ...formData, image: '' })}>
                                <IoTrash />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  {variant === 'Update' && (
                    <div className="mb-4">
                      <div className="border border-dashed border-indigo-600  rounded-lg p-20">
                        <div {...getRootProps()} className="flex justify-center">
                          <input {...getInputProps()} />
                          <p className="">
                            Drop your files here or <b className="text-blue-500 ">Browse</b>.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="xl:w-1/2 w-full mb-3">
            <div className="m-2 h-full">
              <div className="border rounded-lg h-full">
                <div className="flex m-4">
                  <form className="w-full grid grid-cols-1 gap-x-4">
                    <Input
                      id="name"
                      label="Name"
                      placeholder={'e.g. Laptop'}
                      onChange={handleInputChange}
                      required
                      value={formData.name}
                      disabled={variant === 'View'}
                    />
                    <Textarea
                      id={`description`}
                      label="Description"
                      placeholder={
                        'e.g. High-performance laptop with SSD, Smartphone with dual cameras, etc.'
                      }
                      value={formData.description}
                      onChange={handleInputChange}
                      disabled={variant === 'View'}
                    />
                  </form>
                </div>
              </div>
            </div>
          </div>
          {variant === 'Update' && (
            <div className="flex justify-center lg:justify-end w-full">
              <div className="m-2">
                <div className="my-3">
                  <button
                    type="submit"
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                    onClick={handleSubmit}
                  >
                    Update Category
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default CategoryForm
