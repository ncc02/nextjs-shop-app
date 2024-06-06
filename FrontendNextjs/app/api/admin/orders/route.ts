import getSession from '@/app/actions/getSession'
import { NextResponse } from 'next/server'
import prisma from '../../../libs/prismadb'

export async function GET(req: Request) {
  try {
    const session = await getSession()
    const currentUser = session?.user
    if (!currentUser?.id) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized',
          data: {},
          error: {
            message: 'Unauthorized',
          },
        },
        { status: 401 },
      )
    }
    if (currentUser?.role !== 'admin') {
      return NextResponse.json(
        {
          success: false,
          message: 'Forbidden',
          data: {},
          error: {
            message: 'Forbidden',
          },
        },
        { status: 403 },
      )
    }
    const { searchParams } = new URL(req.url)
    const page = Number.parseInt(searchParams.get('page') || '1') || 1
    const pageSize = Number.parseInt(searchParams.get('pageSize') || '6') || 6
    const from = searchParams.get('from')
    const to = searchParams.get('to')
    const orderBy = searchParams.get('orderBy') === 'asc' ? 'asc' : 'desc'
    const createdAt = {
      ...(from ? { gte: new Date(from) } : {}),
      ...(to ? { lte: new Date(Date.parse(to) + 1000 * 60 * 60 * 24) } : {}),
    }
    const orders = await prisma.order.findMany({
      where: {
        createdAt,
      },
      take: pageSize,
      orderBy: {
        createdAt: orderBy,
      },
      skip: pageSize * (page - 1),
      include: {
        user:true,
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Get success',
      data: { orders },
      error: {},
    })
  } catch (error) {
    console.log('[OrdersAdmin]', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Internal error',
        data: {},
        error: {
          message: 'Internal error',
        },
      },
      { status: 500 },
    )
  }
}
