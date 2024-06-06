'use client'

import Button from '@/app/(site)/components/Button'
import Input from '@/app/(site)/components/inputs/Input'
import useLoading from '@/app/hooks/useLoading'
import axios, { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import { memo, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaAngleDown, FaAngleRight } from 'react-icons/fa6'

const PasswordForm = () => {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isForgetPW, setIsForgetPW] = useState(false)
  const { setIsLoading, isLoading } = useLoading()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      otp: '',
      password: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  const onSubmit: SubmitHandler<FieldValues> = async data => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error('Password do not match!')
      return
    }
    setIsLoading(true)
    try {
      await axios.put('api/settings/password', data)
      toast.success('Update successfully!')
      router.refresh()
    } catch (error) {
      const err = error as AxiosError

      toast.error(err.response?.data ? (err.response?.data as string) : 'Something went wrong')
    }
    setIsLoading(false)
  }
  const onRequestOTP = async () => {
    setIsLoading(true)
    try {
      await axios.post('api/settings/request-otp')
      toast.success('Please check your email to get OTP code!')
      setIsForgetPW(true)
    } catch (error) {
      toast.error('Something went wrong!')
    }
    setIsLoading(false)
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-12 pt-2">
        <div className="border-gray-900/10 pb-12">
          <div
            className="flex items-center justify-between select-none hover:bg-neutral-200 p-2 rounded-md cursor-pointer"
            onClick={() => {
              setIsOpen(state => !state)
            }}
          >
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Security information
            </h2>
            {isOpen ? <FaAngleDown /> : <FaAngleRight />}
          </div>

          {isOpen && (
            <>
              <div className="mt-4 grid grid-cols-1 gap-8">
                <div>
                  {isForgetPW ? (
                    <Input
                      label="OTP code"
                      id="otp"
                      errors={errors}
                      required
                      register={register}
                      disabled={isLoading}
                    />
                  ) : (
                    <Input
                      label="Password"
                      id="password"
                      type="password"
                      errors={errors}
                      required
                      register={register}
                      disabled={isLoading}
                    />
                  )}
                  <div className="flex">
                    <Button secondary type="button" disabled={isLoading} onClick={onRequestOTP}>
                      {isForgetPW ? 'Resend otp code?' : 'Forget password?'}
                    </Button>
                    {isForgetPW && (
                      <Button
                        secondary
                        type="button"
                        disabled={isLoading}
                        onClick={() => {
                          setIsForgetPW(false)
                        }}
                      >
                        Using password?
                      </Button>
                    )}
                  </div>
                </div>
                <Input
                  label="New password"
                  id="newPassword"
                  type="password"
                  required
                  errors={errors}
                  register={register}
                  disabled={isLoading}
                />
                <Input
                  label="Confirm password"
                  required
                  id="confirmPassword"
                  type="password"
                  errors={errors}
                  register={register}
                  disabled={isLoading}
                />
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
            </>
          )}
        </div>
      </div>
    </form>
  )
}

export default memo(PasswordForm)
