'use client'
import Button from '@/app/(site)/components/Button'
import Input from '@/app/(site)/components/inputs/Input'
import useLoading from '@/app/hooks/useLoading'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { memo, useEffect } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

const LoginForm = () => {
  const { isLoading, setIsLoading } = useLoading()
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      email: '',
      password: '',
    },
  })
  useEffect(() => {
    setIsLoading(false)
  }, [setIsLoading])
  const onSubmit: SubmitHandler<FieldValues> = async data => {
    setIsLoading(true)
    try {
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
      toast.error('Something went wrong')
    }
    setIsLoading(false)
  }

  return (
    <div className="mt-8 w-auto">
      <div className="bg-white shadow rounded-lg px-8 py-8 mx-auto">
        <h2 className="mb-2 text-xl font-bold tracking-tight text-gray-900">Welcome</h2>
        <p className="mb-6 text-neutral-500 text-sm">Please login here</p>
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
          <Input
            id="password"
            label="Password"
            type="password"
            register={register}
            errors={errors}
            disabled={isLoading}
            required
          />
          <div>
            <Button disabled={isLoading} fullWidth type="submit">
              Sign in
            </Button>
          </div>
        </form>
        <div className="mt-6">
          <div className="flex gap-2 justify-between text-sm mt-6 px-2 text-gray-500">
            <Link
              href="/register"
              className="underline cursor-pointer"
              onClick={() => {
                setIsLoading(true)
              }}
            >
              Create an account?
            </Link>
            <Link
              href="/forget-password"
              className="underline cursor-pointer"
              onClick={() => {
                setIsLoading(true)
              }}
            >
              Forget password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(LoginForm)
