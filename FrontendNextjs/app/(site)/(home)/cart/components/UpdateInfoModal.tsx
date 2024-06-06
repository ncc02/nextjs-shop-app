'use client'

import Button from '@/app/(site)/components/Button'
import Modal from '@/app/(site)/components/Modal'
import Input from '@/app/(site)/components/inputs/Input'
import useLoading from '@/app/hooks/useLoading'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
interface AddressModalProps {
  isOpen: boolean
  onClose: () => void
  userName: string
}

const UndateInfoModal = ({ isOpen, onClose, userName }: AddressModalProps) => {
  const { isLoading, loading, unLoading } = useLoading()
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: userName,
      address: '',
      phoneNumber: '',
    },
  })
  const onSubmit: SubmitHandler<FieldValues> = async data => {
    loading()
    try {
      await axios.put('api/settings', data)
      toast.success('Update successfully!')
      router.refresh()
      onClose()
    } catch (error) {
      toast.error('Something went wrong')
    }
    unLoading()
  }
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h5 className="">Please fill your info to get order</h5>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 grid grid-cols-1 gap-4">
        <Input label="Name" id="name" errors={errors} register={register} disabled={isLoading} />
        <Input
          label="Phone number"
          id="phoneNumber"
          errors={errors}
          register={register}
          disabled={isLoading}
        />
        <Input
          label="Address"
          id="address"
          errors={errors}
          required
          register={register}
          disabled={isLoading}
        />
        <div className="mt-4" />
        <Button type="submit">Confirm</Button>
      </form>
    </Modal>
  )
}

export default UndateInfoModal
