import getSession from '@/app/actions/getSession'
import { Prisma } from '@prisma/client'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
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
    const body = await req.json()

    const { productId, quantity } = body

    if (!productId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing value',
          data: {},
          error: {
            field: 'productId',
            message: 'ProductID is required',
          },
        },
        { status: 400 },
      )
    }

    if (!quantity || quantity === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing value',
          data: {},
          error: {
            field: 'quantity',
            message: 'Quantity is required',
          },
        },
        { status: 400 },
      )
    }

    const product = await prisma?.product.findUnique({
      where: {
        id: productId,
      },
    })
    if (!product)
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid product',
          data: {},
          error: {
            field: 'product',
            message: 'Invalid product',
          },
        },
        { status: 400 },
      )
    const [imported, updated] = await Promise.all([
      await prisma?.import.create({
        data: {
          productId,
          quantity,
        },
      }),
      await prisma?.product.update({
        where: {
          id: product.id,
        },
        data: {
          quantity: product.quantity + quantity,
        },
      }),
    ])
    return NextResponse.json({
      success: true,
      message: 'Create success',
      data: { imported, updated },
      error: {},
    })
  } catch (error) {
    console.log('ImportProduct]', error)
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
    const page = parseInt(searchParams.get('page') || '1') || 1
    const pageSize = parseInt(searchParams.get('limit') || '10') || 10
    const name = searchParams.get('name')
    const from = searchParams.get('from')
    const to = searchParams.get('to')
    const productId = searchParams.get('productId')
    const orderBy = searchParams.get('orderBy') === 'asc' ? 'asc' : 'desc'
    const createdAt = {
      ...(from ? { gte: new Date(from) } : {}),
      ...(to ? { lte: new Date(Date.parse(to) + 1000 * 60 * 60 * 24) } : {}),
    }
    const searchConditions: Prisma.ImportWhereInput = {
      ...(productId
        ? {
            productId,
          }
        : name
        ? {
            product: {
              name: {
                contains: name,
                mode: 'insensitive',
              },
            },
          }
        : {}),
      createdAt,
    }

    const skip = (page - 1) * pageSize
    const take = pageSize

    const [imports, totalCount] = await Promise.all([
      await prisma?.import.findMany({
        where: searchConditions,
        include: {
          product: true,
        },
        skip,
        take,
        orderBy: {
          createdAt: orderBy,
        },
      }),
      await prisma?.import.count({
        where: searchConditions,
      }),
    ])
    return NextResponse.json({
      success: true,
      message: 'Get success',
      data: { imports, totalCount },
      error: {},
    })
  } catch (error) {
    console.log('[GET IMPORTS]', error)
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
