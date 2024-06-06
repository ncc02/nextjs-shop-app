'use client'

import Button from '@/app/(site)/components/Button'
import Input from '@/app/(site)/components/inputs/Input'
import useLoading from '@/app/hooks/useLoading'
import axios from 'axios'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { memo, useEffect } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

const RegisterForm = () => {
  const router = useRouter()
  const { isLoading, setIsLoading } = useLoading()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })
  useEffect(() => {
    setIsLoading(false)
  }, [setIsLoading])
  const onSubmit: SubmitHandler<FieldValues> = async data => {
    if (data.password !== data.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    setIsLoading(true)

    try {
      await axios.post('api/register', data)

      const res = await signIn('credentials', {
        ...data,
        redirect: false,
      })

      if (res?.error) toast.error('Invalid credentials')
      else if (res?.ok) {
        toast.success('Logged in!')
        router.refresh()
      }
    } catch (error) {
      toast.error('Your email has already been registered!')
    }
    setIsLoading(false)
  }

  return (
    <div className="mt-8 w-auto mx-2">
      <div className="bg-white shadow rounded-lg px-8 py-8 mx-auto">
        <h2 className="mb-2 text-xl font-bold tracking-tight text-gray-900">Create account</h2>
        <p className="mb-6 text-neutral-500 text-sm">Please enter details</p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            id="name"
            label="Name"
            register={register}
            errors={errors}
            disabled={isLoading}
            required
          />
          <Input
            id="email"
            label="Email address"
            type="email"
            register={register}
            errors={errors}
            disabled={isLoading}
            required
          />
          <Input
            id="password"
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
            type="password"
            register={register}
            errors={errors}
            disabled={isLoading}
            required
          />
          <div>
            <Button disabled={isLoading} fullWidth type="submit">
              Register
            </Button>
          </div>
        </form>
        <div className="mt-6">
          <div className="flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500">
            <div>Already have an account?</div>
            <Link
              href="/login"
              className="underline cursor-pointer"
              onClick={() => {
                setIsLoading(true)
              }}
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(RegisterForm)
