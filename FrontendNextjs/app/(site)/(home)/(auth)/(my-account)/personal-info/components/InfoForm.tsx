'use client'
import Input from '@/app/(site)/components/inputs/Input'
import useLoading from '@/app/hooks/useLoading'
import axios from 'axios'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { memo } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { CldUploadButton } from 'next-cloudinary'
import Button from '@/app/(site)/components/Button'
import { format } from 'date-fns'
import { PublicUserType } from '@/app/types'

interface InfoFormProps {
  user: PublicUserType
}

const InfoForm = ({ user }: InfoFormProps) => {
  const router = useRouter()
  const { setIsLoading, isLoading } = useLoading()
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: user.name,
      phoneNumber: user.phoneNumber,
      address: user.address,
      birthDate: user.birthDate ? format(user.birthDate, 'yyyy-MM-dd') : '',
      image: user.image,
    },
  })

  const image = watch('image')

  const handleUpload = (result: any) => {
    setValue('image', result.info.secure_url, {
      shouldValidate: true,
    })
  }
  const onSubmit: SubmitHandler<FieldValues> = async data => {
    setIsLoading(true)
    try {
      await axios.put('api/settings', data)
      toast.success('Update successfully!')
      router.refresh()
    } catch (error) {
      toast.error('Something went wrong')
    }
    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-12 border-b">
        <div className="border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">Personal information</h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">Edit your public information</p>
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Input
              label="Name"
              id="name"
              errors={errors}
              required
              register={register}
              disabled={isLoading}
            />
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
              register={register}
              disabled={isLoading}
            />
            <Input
              label="Birth day"
              id="birthDate"
              errors={errors}
              type="date"
              register={register}
              disabled={isLoading}
            />
            <div>
              <label className="block text-sm font-medium leading-6 text-gray-900">Photo</label>
              <div className="mt-2 flex items-center gap-x-3">
                <div
                  className="
                        relative
                        inline-block
                        rounded-full
                        h-16
                        w-16
                    "
                >
                  <Image
                    className="rounded-full object-cover"
                    src={image || user.image || '/images/avt.png'}
                    fill
                    alt="Avatar"
                  />
                </div>

                <CldUploadButton
                  options={{ maxFiles: 1 }}
                  onUpload={handleUpload}
                  uploadPreset="viwwlrtz"
                >
                  <div className="font-bold text-sm">Change</div>
                </CldUploadButton>
              </div>
            </div>
          </div>
          <div
            className="
                mt-8
                w-32
                flex
                flex-col
              "
          >
            <Button disabled={isLoading} type="submit">
              Save
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}

export default memo(InfoForm)
