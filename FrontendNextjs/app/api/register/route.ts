import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import prisma from '../../libs/prismadb'
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      name,
      email,
      password,
      confirmPassword,
    }: { name: string; email: string; password: string; confirmPassword: string } = body
    if (!email || !name || !password || password !== confirmPassword) {
      return new NextResponse('Missing infor', { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    const user = await prisma?.user.create({
      data: { name, email: email.toLowerCase(), hashedPassword },
    })

    return NextResponse.json(user)
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
