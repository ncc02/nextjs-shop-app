'use client'

import useLoading from '@/app/hooks/useLoading'
import Input from './Input'
import { useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Product } from '@prisma/client'
import clsx from 'clsx'
import { useRouter } from 'next/navigation'

interface FormData {
  quantity: number
}

const ImportForm = ({ product }: { product: Product }) => {
  const [formData, setFormData] = useState<FormData>({
    quantity: 1,
  })
  const { loading, unLoading, isLoading } = useLoading()
  const router = useRouter()
  const handleImport = async () => {
    if (formData.quantity === 0) return
    loading()
    try {
      const res = await axios.post('/api/imports', {
        productId: product.id,
        quantity: formData.quantity,
      })
      toast.success('Import successfully')
      router.refresh()
    } catch (error) {
      console.log(error)
      toast.error('Import error')
    }
    unLoading()
  }
  return (
    <div className="xl:w-1/2 w-full mb-3">
      <div className="border rounded-lg">
        <div className="flex m-4">
          <form className="w-full grid grid-cols-1 sm:grid-cols-3 gap-x-4">
            <div className="sm:col-span-3">
              <Input id="name" label="Product Name" value={product.name} disabled />
            </div>
            <Input id="price" label="Price (VND)" type="number" value={product.price} disabled />
            <Input id="quantity" label="Quantity" type="number" value={product.quantity} disabled />
            <Input
              id="active"
              label="Active"
              value={product.isActive ? 'Active' : 'Inactive'}
              disabled
            />
          </form>
        </div>
      </div>

      <div className="m-4">
        <Input
          id="import"
          label="Number Import"
          placeholder={'e.g. 7'}
          type="number"
          value={formData.quantity}
          onChange={e => setFormData({ quantity: Number.parseInt(e.target.value) })}
          required
        />
        <button
          type="submit"
          className={clsx(
            'ml-2 text-white bg-blue-700 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center ',
            isLoading && 'bg-gray-600',
          )}
          onClick={handleImport}
          disabled={isLoading}
        >
          Import
        </button>
      </div>
    </div>
  )
}

export default ImportForm
