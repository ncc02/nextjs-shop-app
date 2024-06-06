import getSession from '@/app/actions/getSession'
import { NextResponse } from 'next/server'
import prisma from '../../libs/prismadb'

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
    if (currentUser.role !== 'admin') {
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

    const { name, description, image } = body.data

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing value',
          data: {},
          error: {
            field: 'name',
            message: 'Name is required',
          },
        },
        { status: 400 },
      )
    }

    if (!image) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing value',
          data: {},
          error: {
            field: 'image',
            message: 'Image is required',
          },
        },
        { status: 400 },
      )
    }

    const category = await prisma?.category.create({
      data: {
        name,
        image,
        description,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Create success',
      data: { category },
      error: {},
    })
  } catch (error) {
    console.log('[PRODUCTS_POST]', error)
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
    const { searchParams } = new URL(req.url)
    const name = searchParams.get('name')
    const page = searchParams.get('page')
    const pageSize = searchParams.get('pageSize')
    const orderBy = searchParams.get('orderBy') === 'desc' ? 'desc' : 'asc'
    const currentPage = page ? page : '1'
    const currentPageSize = pageSize ? pageSize : '10'
    const searchConditions: any = {}

    if (name) {
      searchConditions.name = {
        contains: name,
        mode: 'insensitive',
      }
    }
    const hasSearchConditions = Object.keys(searchConditions).length > 0

    const skip = (parseInt(currentPage) - 1) * parseInt(currentPageSize)
    const take = parseInt(currentPageSize)

    const [categories, totalCount] = await Promise.all([
      await prisma?.category.findMany({
        where: hasSearchConditions ? { AND: [searchConditions] } : {},
        skip,
        take,
        orderBy: {
          name: orderBy,
        },
      }),
      await prisma?.category.count({
        where: hasSearchConditions ? { AND: [searchConditions] } : {},
      }),
    ])
    return NextResponse.json({
      success: true,
      message: 'Get success',
      data: { categories, totalCount },
      error: {},
    })
  } catch (error) {
    console.log('[CATEGORIES_GET]', error)
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
