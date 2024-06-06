'use client'

import { useEffect, useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import Input from './components/Input'
import useLoading from '@/app/hooks/useLoading'
import axios from 'axios'
import toast from 'react-hot-toast'
import Textarea from './components/Textarea'
import { IoTrash } from 'react-icons/io5'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface FormData {
  name: string
  price: string
  quantity: string
  isActive: string
  images: string[]
  categoryId: string
  description: string
}

interface Image {
  url: string
  name: string
  format: string
  size: string
}

//{"id":"65b0baead4ebca7ec8e38cc6","name":"Watches","image":"https://res.cloudinary.com/dtpfmivql/image/upload/v1706081280/nltwsimlotaktjk1nroq.png","description":null,"createdAt":"2024-01-22T07:38:51.963Z","updatedAt":"2024-01-22T07:38:51.963Z","productIds":["65b38eadc263c1dfebfb1be1"]}
interface Category {
  id?: string
  name?: string
  image?: string
  description?: string
  createdAt?: string
  updatedAt?: string
  productIds?: string[]
}

const Home = () => {
  const { setIsLoading } = useLoading()
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    name: '',
    price: '',
    quantity: '',
    isActive: 'true',
    images: [],
    categoryId: '',
    description: '',
  })
  const [images, _setImages] = useState<Image[]>([])
  const setImageItem = (img: Image) => {
    _setImages(prevImages => [...prevImages, img])
  }

  const [categories, setCategories] = useState<Category[]>([])

  const [files, setFiles] = useState([])

  const onDrop = useCallback((acceptedFiles: any) => {
    setFiles(
      acceptedFiles.map((file: any) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        }),
      ),
    )
  }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  useEffect(() => {
    const handleUpload = () => {
      const url = 'https://api.cloudinary.com/v1_1/johnpaul/image/upload'
      const formData = new FormData()
      let file = files[0]
      formData.append('file', file)
      formData.append('upload_preset', 'dryqolej')
      setIsLoading(true)
      axios({
        method: 'post',
        url: url,
        data: formData,
      })
        .then(response => {
          setIsLoading(false)
          setImageItem({
            url: response.data.secure_url,
            name: response.data.public_id,
            format: response.data.format,
            size: response.data.bytes,
          })
        })
        .catch(error => {
          setIsLoading(false)
          console.error('Error:', error)
        })
    }
    if (files.length !== 0) {
      handleUpload()
    }
  }, [files, setIsLoading])

  const handleInputChange = (event: any) => {
    const { name, value } = event.target // Check if event.target is defined
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }))
  }

  useEffect(() => {
    const imageData = images.map(image => {
      return image.url
    })
    setFormData(prevFormData => ({
      ...prevFormData,
      images: imageData,
    }))
  }, [images])

  //fetch categories
  useEffect(() => {
    axios({
      method: 'get',
      url: '/api/categories',
    })
      .then(response => {
        if (response.data.success) {
          setCategories(response.data.data.categories)
        } else {
          toast.error(response.data.error.message)
        }
      })
      .catch(error => {
        console.log(error)
        toast.error(error.response.data.error?.message)
      })
  }, [])

  const handleSubmit = () => {
    setIsLoading(true)
    axios({
      method: 'post',
      url: '/api/products',
      data: formData,
    })
      .then(response => {
        setIsLoading(false)
        if (response.data.success) {
          toast.success(response.data.message)
          router.push(`/admin/products/${response.data.data.product.id}`)
        } else {
          toast.error(response.data.error.message)
        }
      })
      .catch(error => {
        setIsLoading(false)
        console.log(error)
        toast.error(error.response.data.error.message)
      })
  }

  const handleDeleteImage = (value: any) => {
    _setImages(prevImages => prevImages.filter((_, index) => String(index) !== String(value)))
  }

  return (
    <>
      <div className="bg-white px-6 rounded-lg  w-full h-full">
        <div className="p-2">
          <div className="p-2">
            <h1 className="text-xl text-gray-500 font-semibold ">Add New Product</h1>
          </div>
          <div className="">
            <div className="flex flex-wrap ">
              <div className="xl:w-1/2 w-full mb-3">
                <div className="m-2 h-full">
                  <div className="border rounded-lg h-full">
                    <div className="m-4">
                      <div className="mb-2">
                        <h3 className="block text-sm  text-gray-500 font-semibold "> Add images</h3>
                      </div>
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
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-2">
                        {images.map((image, index) => {
                          return (
                            <div
                              key={index}
                              className="flex items-center mb-2 border border-gray-300  rounded-lg p-2"
                            >
                              <div className="flex justify-between items-center w-full">
                                <div className=" flex items-center">
                                  <div className="h-16 w-16 overflow-hidden mr-3 rounded-lg">
                                    <Image
                                      className="h-full w-auto"
                                      src={image.url}
                                      alt=""
                                      width={100}
                                      height={100}
                                    />
                                  </div>
                                  <div className="hidden sm:flex flex-col text-gray-500 ">
                                    <h3 className="text-md">
                                      <b>
                                        picture{index}.{image.format}
                                      </b>
                                    </h3>
                                    <span className="text-xs font-normal">
                                      {(Number(image.size) / 1024).toFixed(3)}KB
                                    </span>
                                  </div>
                                </div>
                                <div className="px-3 py-3 text-2xl rounded-3xl text-gray-600 hover:text-red-600 hover:text-3xl">
                                  <div onClick={() => handleDeleteImage(index)}>
                                    <IoTrash />
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="xl:w-1/2 w-full mb-3">
                <div className="m-2 h-full">
                  <div className="border rounded-lg h-full">
                    <div className="flex m-4">
                      <form className="w-full grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                        <Input
                          id="name"
                          label="Product Name"
                          placeholder={'e.g. Laptop'}
                          onChange={handleInputChange}
                          required
                        />
                        <Input
                          id="price"
                          label="Price (VND)"
                          placeholder={'e.g. 2399900'}
                          type="number"
                          onChange={handleInputChange}
                          required
                        />

                        <Input
                          id="quantity"
                          label="Quantity"
                          placeholder={'e.g. 10'}
                          type="number"
                          onChange={handleInputChange}
                          required
                        />

                        <div className="mb-6">
                          <label
                            htmlFor="active"
                            className="block mb-2  text-sm text-gray-500 font-semibold "
                          >
                            Active
                          </label>
                          <select
                            id="isActive"
                            name="isActive"
                            value={formData['isActive']}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            required
                            onChange={handleInputChange}
                          >
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                          </select>
                        </div>
                        <div className="mb-6">
                          <label
                            htmlFor="active"
                            className="block mb-2  text-sm text-gray-500 font-semibold "
                          >
                            Category
                          </label>
                          <select
                            id="categoryId"
                            name="categoryId"
                            value={formData['categoryId']}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            required
                            onChange={handleInputChange}
                          >
                            <option value="">No Categories</option>
                            {categories?.map(category => {
                              return (
                                <option value={category.id} key={category.id}>
                                  {category.name}
                                </option>
                              )
                            })}
                          </select>
                        </div>
                        <Textarea
                          id={`description`}
                          label="Description"
                          className="col-span-2"
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
                      Create Product
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
