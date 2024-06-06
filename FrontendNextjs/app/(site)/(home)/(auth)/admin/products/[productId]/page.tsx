'use client'

import { useEffect, useState, useCallback, ChangeEvent } from 'react'
import { useDropzone } from 'react-dropzone'
import axios from 'axios'
import useLoading from '@/app/hooks/useLoading'

import Input from './components/Input'
import toast from 'react-hot-toast'
import Textarea from './components/Textarea'
import { IoTrash } from 'react-icons/io5'
import { useParams, useRouter } from 'next/navigation'
import Wanning from './components/Wanning'
import Link from 'next/link'
import Image from 'next/image'

interface FormData {
  name: string
  price: string
  quantity: string
  isActive: string
  images: string[]
  categoryId: string
  description: string
}

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
  const router = useRouter()
  const { setIsLoading } = useLoading()
  const [preFetchDataLoading, setPreFetchDataLoading] = useState(true)

  // Get Product ID in params
  const params = useParams<{ productId: string }>()
  const { productId } = params

  //not found product
  const [isProdNotFound, setIsProdNotFound] = useState(false)

  //check update is active
  const [isUpdate, _setIsUpdate] = useState(false)
  const setIsUpdate = (value: boolean) => {
    _setIsUpdate(value)
  }

  //check delete is active
  const [isDelete, _setIsDelete] = useState(false)
  const setIsDelete = (value: boolean) => {
    _setIsDelete(value)
  }

  //Save form data before modify
  const [formDataBeforeModify, setFormDataBeforeModify] = useState<FormData>({
    name: '',
    price: '',
    quantity: '',
    isActive: '',
    images: [],
    categoryId: '',
    description: '',
  })

  const [formData, setFormData] = useState<FormData>({
    name: '',
    price: '',
    quantity: '',
    isActive: '',
    images: [],
    categoryId: '',
    description: '',
  })

  const [categories, setCategories] = useState<Category[]>([])

  //save files image before upload to cloudinary
  const [files, setFiles] = useState([])

  // upload image
  const onDrop = useCallback((acceptedFiles: any) => {
    setFiles(
      acceptedFiles.map((file: any) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        }),
      ),
    )
  }, [])

  //dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
    },
  })

  //upload image to cloudinary

  //upload image to cloudinary when user drop image to dropzone or select image from browse
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
          setFormData(prevFormData => ({
            ...prevFormData,
            images: [...prevFormData.images, response.data.secure_url],
          }))
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

  //delete image from formData
  const handleDeleteImage = (value: any) => {
    setFormData(prevFormData => {
      const newImages = prevFormData.images.filter((_, i) => i !== value)
      return {
        ...prevFormData,
        images: newImages,
      }
    })
  }

  //get product detail
  useEffect(() => {
    setIsLoading(true)
    setPreFetchDataLoading(true)
    axios({
      method: 'get',
      url: `/api/products/${productId}`,
      data: {},
    })
      .then(response => {
        setPreFetchDataLoading(false)
        setIsLoading(false)
        if (Object.keys(response.data.data.product).length === 0) {
        } else {
          setIsProdNotFound(true)
          setPreFetchDataLoading(false)
          const data = {
            name: response.data.data.product.name || null,
            price: response.data.data.product.price || null,
            quantity: response.data.data.product.quantity || null,
            isActive: response.data.data.product.isActive ? 'true' : 'false',
            images: response.data.data.product.images || null,
            categoryId: response.data.data.product.categoryIds[0] || '',
            description: response.data.data.product.description || null,
          }
          setFormDataBeforeModify(data)
          setFormData(data)
        }
      })
      .catch(error => {
        setIsLoading(false)
        setPreFetchDataLoading(false)
        console.error('Error:', error)
      })
  }, [setIsLoading, productId])

  //fetch categories
  useEffect(() => {
    setIsLoading(true)
    axios({
      method: 'get',
      url: '/api/categories',
    })
      .then(response => {
        setIsLoading(false)
        if (response.data.success) {
          setCategories(response.data.data.categories)
        } else {
          setIsLoading(false)
          toast.error(response.data.error.message)
        }
      })
      .catch(error => {
        setIsLoading(false)
        console.log(error)
        toast.error(error.response.data.error?.message)
      })
  }, [setIsLoading])
  //handle input change
  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target // Check if event.target is defined
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }))
  }

  //handle update button
  const onClickUpdate = () => {
    setIsUpdate(!isUpdate)
  }

  const handleCancelUpdate = () => {
    setFormData(formDataBeforeModify)
    setIsUpdate(false)
  }

  //handle delete button
  const onClickDelete = () => {
    setIsDelete(!isDelete)
  }

  //handle submit form
  const handleUpdateSubmit = () => {
    _setIsUpdate(false)
    setIsLoading(true)
    axios({
      method: 'patch',
      url: `/api/products/${productId}`,
      data: formData,
    })
      .then(response => {
        setIsLoading(false)
        if (response.data.success) {
          toast.success(response.data.message)
          setIsUpdate(false)
          setFormDataBeforeModify(formData)
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

  const handleDeleteSubmit = () => {
    setIsLoading(true)
    axios({
      method: 'delete',
      url: `/api/products/${productId}`,
      data: formData,
    })
      .then(response => {
        setIsLoading(false)
        if (response.data.success) {
          toast.success(response.data.message)
          setIsDelete(false)
          router.back()
        } else {
          setIsProdNotFound(true)
          toast.error(response.data.error.message)
        }
      })
      .catch(error => {
        setIsLoading(false)
        console.log(error)
        toast.error('Cannot delete this product \n Try to change this product to Inactive')
        setIsDelete(false)
        // toast.error(error.message)
      })
  }

  return (
    <>
      <Wanning
        title="Delete Product"
        subTitle="Are you sure you want to delete this product?"
        show={isDelete}
        handleDelete={handleDeleteSubmit}
        onClose={onClickDelete}
      />
      <div className="bg-white px-8 rounded-lg  w-full h-full">
        <div className="p-2">
          <div className="p-2 flex justify-between items-end">
            <h1 className="text-xl text-gray-500 font-semibold ">Product Detail</h1>
            <div className="pt-3">
              <Link
                href={`/admin/imports/${productId}`}
                className={
                  'ml-2 text-white bg-blue-500 hover:bg-blue-400 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center '
                }
                onClick={() => {
                  setIsLoading(true)
                }}
              >
                Import
              </Link>
              <button
                type="submit"
                className={
                  'ml-2 text-white bg-blue-700 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center '
                }
                onClick={onClickUpdate}
              >
                Update
              </button>
              <button
                type="submit"
                className={
                  'ml-2 text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center'
                }
                onClick={onClickDelete}
              >
                Delete
              </button>
            </div>
          </div>
          <div className="">
            <div className="flex flex-wrap ">
              {!isProdNotFound && !preFetchDataLoading ? (
                <div className="w-full mb-3">
                  <div className="m-2 h-full">
                    <div className="border rounded-lg h-full p-12">
                      <div className="flex flex-col items-center justify-center h-full">
                        <h2 className="mb-3 text-2xl ">Product Not Found</h2>
                        <button
                          type="submit"
                          className={
                            'ml-2 text-white bg-blue-700 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center '
                          }
                          onClick={() => router.push('/admin/products/add-product')}
                        >
                          Add Product
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="xl:w-1/2 w-full mb-3">
                    <div className="m-2 h-full">
                      <div className="border  rounded-lg h-full">
                        <div className="m-4">
                          <div className="mb-2">
                            <h3 className="block text-sm  text-gray-500 font-semibold ">
                              {' '}
                              {isUpdate ? 'Add Images' : 'Images'}
                            </h3>
                          </div>
                          {isUpdate ? (
                            <div className="mb-4">
                              <div
                                {...getRootProps()}
                                className={`border ${
                                  isDragActive ? 'border-2' : ''
                                } border-dashed border-indigo-600  rounded-lg p-20`}
                              >
                                <div className="flex justify-center">
                                  <input {...getInputProps()} />
                                  {/* isDragActive? return label drop : return label drag */}

                                  {!isDragActive ? (
                                    <p className="text-gray-500 text-center">
                                      Drop your files here or{' '}
                                      <b className="text-blue-500 ">Browse</b>.
                                    </p>
                                  ) : (
                                    <p>Drag file here, or click to select files</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <></>
                          )}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-2">
                            {formData.images.map((image, index) => {
                              return (
                                <div
                                  key={index}
                                  className="flex items-center mb-2 border border-gray-300 rounded-lg p-2"
                                >
                                  <div className="flex justify-between items-center w-full">
                                    <div className=" flex items-center">
                                      <div className="h-16 w-16 overflow-hidden mr-3 rounded-lg">
                                        <Image
                                          width={100}
                                          height={100}
                                          className="h-full w-auto"
                                          src={image}
                                          alt=""
                                        />
                                      </div>
                                      <div className="hidden sm:flex flex-col text-gray-500 ">
                                        <h3 className="text-md">
                                          <b>
                                            picture{index}.
                                            {String(image.split('/').pop()).split('.').pop()}
                                          </b>
                                        </h3>
                                        {/* <span className="text-xs font-normal">{(Number(image.size)/1024).toFixed(3)}KB</span> */}
                                      </div>
                                    </div>
                                    <div
                                      className={`${
                                        !isUpdate
                                          ? 'hover:cursor-not-allowed'
                                          : 'hover:text-red-600 hover:text-3xl'
                                      } px-3 py-3 text-2xl rounded-3xl  text-gray-600 `}
                                    >
                                      <div
                                        onClick={() => (isUpdate ? handleDeleteImage(index) : true)}
                                      >
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
                              value={formData['name']}
                              disabled={!isUpdate}
                              onChange={handleInputChange}
                              required
                            />
                            <Input
                              id="price"
                              label="Price (VND)"
                              placeholder={'e.g. 2399900'}
                              type="number"
                              value={formData['price']}
                              disabled={!isUpdate}
                              onChange={handleInputChange}
                              required
                            />

                            <Input
                              id="quantity"
                              label="Quantity"
                              placeholder={'e.g. 10'}
                              type="number"
                              value={formData['quantity']}
                              disabled={!isUpdate}
                              onChange={handleInputChange}
                              required
                            />

                            <div className="mb-6">
                              <label
                                htmlFor="active"
                                className="block mb-2  text-sm text-gray-500 font-semibold"
                              >
                                Active
                              </label>
                              <select
                                id="isActive"
                                name="isActive"
                                value={formData['isActive']}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                required
                                disabled={!isUpdate && !isDelete}
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
                                disabled={!isUpdate && !isDelete}
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
                              disabled={!isUpdate}
                              onChange={handleInputChange}
                            />
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
              <div className="flex justify-center lg:justify-end w-full">
                <div className="m-2">
                  <div className="my-3">
                    <div className="inline-block ml-2">
                      <button
                        type="submit"
                        className={
                          !isUpdate
                            ? 'hidden'
                            : 'text-white bg-blue-700 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center '
                        }
                        onClick={handleUpdateSubmit}
                      >
                        Save
                      </button>
                    </div>
                    <div className="inline-block ml-2">
                      <button
                        type="submit"
                        className={
                          !isUpdate
                            ? 'hidden'
                            : 'text-gray font-normal bg-slate-100 hover:bg-red-600 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 border  rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center '
                        }
                        onClick={handleCancelUpdate}
                      >
                        Cancel
                      </button>
                    </div>
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
