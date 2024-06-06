'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import Input from '../components/Input'
import useLoading from '@/app/hooks/useLoading'
import axios, { AxiosError } from 'axios'
import toast from 'react-hot-toast'
import Textarea from '../components/Textarea'
import { IoTrash } from 'react-icons/io5'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface FormData {
  name: string
  image: string
  description: string
}

const Home = () => {
  const { loading, unLoading } = useLoading()
  const [formData, setFormData] = useState<FormData>({
    name: '',
    image: '',
    description: '',
  })
  const router = useRouter()

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
      const res = await axios.post('/api/categories', {
        data: formData,
      })
      if (res.data.success) {
        toast.success(res.data.message)
        router.push(`/admin/categories/${res.data.data.category.id}`)
      } else {
        toast.error(res.data.error.message)
      }
    } catch (error) {
      const err = error as AxiosError<{ error: { message: string } }>
      toast.error(err.response?.data?.error?.message || err.message || 'Something went wrong')
    }
    unLoading()
  }

  return (
    <>
      <div className="bg-white px-6 rounded-lg  w-full h-full">
        <div className="p-2">
          <div className="p-2">
            <h1 className="text-xl text-gray-500 font-semibold ">Add New Category</h1>
          </div>
          <div className="">
            <div className="flex flex-wrap ">
              <div className="xl:w-1/2 w-full mb-3">
                <div className="m-2 h-full">
                  <div className="border rounded-lg h-full">
                    <div className="m-4">
                      <div className="mb-2">
                        <h3 className="block text-sm  text-gray-500 font-semibold ">
                          {formData.image ? 'Update' : 'Add'} image
                        </h3>
                      </div>
                      {formData.image && (
                        <div className="grid grid-cols-1 gap-x-2">
                          <div className="flex items-center mb-2 border border-gray-300  rounded-lg p-2">
                            <div className="flex justify-between items-center w-full">
                              <div className=" flex items-center">
                                <div className="h-16 w-16 overflow-hidden mr-3 rounded-lg">
                                  <Image
                                    width={100}
                                    height={100}
                                    className="h-full w-auto"
                                    src={formData.image}
                                    alt=""
                                  />
                                </div>
                                <div className="hidden sm:flex flex-col text-gray-500 "></div>
                              </div>
                              <div className="px-3 py-3 text-2xl rounded-3xl text-gray-600 hover:text-red-600 hover:text-3xl">
                                <div onClick={() => setFormData({ ...formData, image: '' })}>
                                  <IoTrash />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
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
                        />
                        <Textarea
                          id={`description`}
                          label="Description"
                          placeholder={
                            'e.g. High-performance laptop with SSD, Smartphone with dual cameras, etc.'
                          }
                          value={formData['description']}
                          onChange={handleInputChange}
                        />
                      </form>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center lg:justify-end w-full">
                <div className="m-2">
                  <div className="my-3">
                    <button
                      type="submit"
                      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                      onClick={handleSubmit}
                    >
                      Create Category
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home
