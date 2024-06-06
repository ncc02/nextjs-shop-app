import { NextResponse } from 'next/server'
import prisma from '../../../libs/prismadb'
import getSession from '@/app/actions/getSession'
import bcrypt from 'bcryptjs'

export async function PUT(req: Request) {
  try {
    const session = await getSession()
    const currentUser = session?.user
    if (!currentUser?.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }
    const body = await req.json()

    const { otp, password, newPassword, confirmPassword } = body

    if (!newPassword || newPassword !== confirmPassword)
      return new NextResponse('Passwords do not match', { status: 400 })

    const user = await prisma.user.findUnique({ where: { id: currentUser.id } })
    if (!user) return new NextResponse('Unauthorized', { status: 401 })

    if (password) {
      const isCorrectPassword = await bcrypt.compare(password, user.hashedPassword!)
      if (!isCorrectPassword) return new NextResponse('Invalid password', { status: 403 })

      const updatedUser = await prisma?.user.update({
        where: {
          id: currentUser.id,
        },
        data: {
          hashedPassword: await bcrypt.hash(newPassword, 12),
        },
      })
      return NextResponse.json(updatedUser)
    }
    if (otp && user.otp && user.otpExpireAt) {
      if (otp !== user.otp || user.otpExpireAt.getTime() < Date.now())
        return new NextResponse('Invalid otp', { status: 403 })

      const updatedUser = await prisma?.user.update({
        where: {
          id: currentUser.id,
        },
        data: {
          hashedPassword: await bcrypt.hash(newPassword, 12),
        },
      })
      return NextResponse.json(updatedUser)
    }

    return new NextResponse('Invalid request', { status: 400 })
  } catch (error) {
    return new NextResponse('Internal Error', { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, otp, newPassword, confirmPassword } = body
    if (!email) return new NextResponse('Invalid email', { status: 400 })
    if (!newPassword || newPassword !== confirmPassword)
      return new NextResponse('Passwords do not match', { status: 400 })

    const user = await prisma.user.findUnique({ where: { email: `${email}`.toLowerCase() } })
    if (!user) return new NextResponse('Not found', { status: 404 })

    if (otp && user.otp && user.otpExpireAt) {
      if (otp !== user.otp || user.otpExpireAt.getTime() < Date.now())
        return new NextResponse('Invalid otp', { status: 403 })

      const updatedUser = await prisma?.user.update({
        where: {
          id: user.id,
        },
        data: {
          hashedPassword: await bcrypt.hash(newPassword, 12),
        },
      })
      return NextResponse.json(updatedUser)
    }

    return new NextResponse('Invalid request', { status: 400 })
  } catch (error) {
    return new NextResponse('Internal Error', { status: 500 })
  }
}
