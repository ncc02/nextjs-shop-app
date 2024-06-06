import { NextResponse } from 'next/server'
import prisma from '../../../libs/prismadb'
import getSession from '@/app/actions/getSession'

import { render } from '@react-email/render'
import { OTPTemplate } from '@/app/(site)/components/EmailTemplate'
import { sendEmail } from '@/app/libs/sendEmail'

export async function POST(req: Request) {
  try {
    const session = await getSession()
    const currentUser = session?.user
    if (!currentUser?.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const user = await prisma.user.findUnique({ where: { id: currentUser.id } })
    if (!user) return new NextResponse('Unauthorized', { status: 401 })

    const otp = Math.random().toString().slice(3, 7)

    const updatedUser = await prisma?.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        otp,
        otpExpireAt: new Date(Date.now() + 60000),
      },
    })
    sendEmail({
      to: user.email!,
      subject: 'Your OTP',
      html: render(
        OTPTemplate({
          name: user.name!,
          otp: otp,
        }),
      ),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return new NextResponse('Internal Error', { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json()
    const { email }: { email: string } = body
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })
    if (!user) return new NextResponse('Not found', { status: 404 })

    const otp = Math.random().toString().slice(3, 7)

    const updatedUser = await prisma?.user.update({
      where: {
        id: user.id,
      },
      data: {
        otp,
        otpExpireAt: new Date(Date.now() + 60000),
      },
    })
    sendEmail({
      to: user.email!,
      subject: 'Your OTP',
      html: render(
        OTPTemplate({
          name: user.name!,
          otp: otp,
        }),
      ),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return new NextResponse('Internal Error', { status: 500 })
  }
}
