import { NextResponse } from 'next/server'
import prisma from '../../libs/prismadb'
import getSession from '@/app/actions/getSession'
import { isValid } from 'date-fns'
export async function PUT(req: Request) {
  try {
    const session = await getSession()
    const currentUser = session?.user

    const body = await req.json()

    const { image, name, phoneNumber, address, birthDate } = body
    const validDate = new Date(birthDate)

    if (!currentUser?.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }
    if (!name) return new NextResponse('Name is required!', { status: 400 })

    const updatedUser = await prisma?.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        image,
        name,
        phoneNumber,
        address,
        birthDate: isValid(validDate) ? validDate : null,
      },
    })
    return NextResponse.json(updatedUser)
  } catch (error) {
    return new NextResponse('Internal Error', { status: 500 })
  }
}
