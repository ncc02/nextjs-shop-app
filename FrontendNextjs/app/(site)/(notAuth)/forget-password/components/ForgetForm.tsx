'use client'
import Button from '@/app/(site)/components/Button'
import Input from '@/app/(site)/components/inputs/Input'
import useLoading from '@/app/hooks/useLoading'
import axios from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { memo, useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { IoChevronBack } from 'react-icons/io5'

const ForgetForm = () => {
  const router = useRouter()
  const [variant, setVariant] = useState<'UNSENT' | 'SENT'>('UNSENT')
  const { isLoading, setIsLoading } = useLoading()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      email: '',
      otp: '',
      newPassword: '',
      confirmPassword: '',
    },
  })
  const email = watch('email')
  useEffect(() => {
    setIsLoading(false)
  }, [setIsLoading])
  const onSubmit: SubmitHandler<FieldValues> = async data => {
    setIsLoading(true)
    try {
      if (variant === 'UNSENT') {
        await axios.put('api/settings/request-otp', data)
        setVariant('SENT')
        toast.success('Please check your email to get OTP code!')
      } else {
        if (data.newPassword !== data.confirmPassword) {
          toast.error('Password do not match!')
        } else {
          await axios.post('api/settings/password', data)
          toast.success('Update successfully!')
          router.replace('/login')
        }
      }
    } catch (error) {
      toast.error('Something went wrong')
    }
    setIsLoading(false)
  }
  const onRequestOTP = async () => {
    if (!email) return
    setIsLoading(true)
    try {
      await axios.put('api/settings/request-otp', { email })
      toast.success('Please check your email to get OTP code!')
    } catch (error) {
      toast.error('Something went wrong!')
    }
    setIsLoading(false)
  }

  return (
    <div className="mt-2 w-auto">
      <Link href={'/login'} className="text-gray-800 text-sm flex mb-8">
        <IoChevronBack size={20} />
        Back
      </Link>
      <div className="bg-white shadow rounded-lg px-8 py-8 mx-auto">
        <h2 className="mb-6 text-xl font-bold tracking-tight text-gray-900">Forgot password</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            id="email"
            label="Email address"
            type="email"
            register={register}
            errors={errors}
            disabled={isLoading}
            required
          />
          {variant !== 'UNSENT' && (
            <>
              <Input
                id="otp"
                label="OTP"
                register={register}
                errors={errors}
                disabled={isLoading}
                required
              />
              <Input
                id="newPassword"
                label="Password"
                type="password"
                register={register}
                errors={errors}
                disabled={isLoading}
                required
              />
              <Input
                id="confirmPassword"
                label="Confirm Password"
                register={register}
                type="password"
                errors={errors}
                disabled={isLoading}
                required
              />
            </>
          )}
          <div>
            <Button disabled={isLoading} fullWidth type="submit">
              Recover password
            </Button>
          </div>
        </form>
        {variant === 'SENT' && (
          <div className="mt-6">
            <div className="flex gap-2 justify-between text-sm mt-6 px-2 text-gray-500">
              <div className="underline cursor-pointer" onClick={onRequestOTP}>
                Resent otp?
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default memo(ForgetForm)
