import { NextResponse } from 'next/server'
import prisma from '../../libs/prismadb'
import getSession from '@/app/actions/getSession'

// API searchProducts
// exam: http://localhost:3000/api/products?name=iphone&minPrice=100&maxPrice=1000&categoryId=1&page=1&pageSize=10
// Note: Khong truyen searchparams thi se get all
export async function GET(req: Request) {
  try {
    const session = await getSession()
    const currentUser = session?.user

    const { searchParams } = new URL(req.url)

    const name = searchParams.get('name')
    const minPrice = Number(searchParams.get('minPrice'))
    const maxPrice = Number(searchParams.get('maxPrice'))
    const categoryId = searchParams.get('categoryId')
    const page = searchParams.get('page')
    const status = searchParams.get('status') ? Number(searchParams.get('status')) : null
    const pageSize = searchParams.get('pageSize')
    const currentPage = page ? page : '1'
    const currentPageSize = pageSize ? pageSize : '10'
    const searchConditions: any = {}

    if (name) {
      searchConditions.name = {
        contains: name,
        mode: 'insensitive',
      }
    }

    if (currentUser?.role !== 'admin') {
      searchConditions.isActive = true
    } else {
      if (status === 0) {
        searchConditions.isActive = true
      }
      if (status === 1) {
        searchConditions.isActive = false
      }
    }

    if (minPrice && maxPrice) {
      searchConditions.price = {
        gte: minPrice,
        lte: maxPrice,
      }
    } else if (minPrice) {
      searchConditions.price = {
        gte: minPrice,
      }
    } else if (maxPrice) {
      searchConditions.price = {
        lte: maxPrice,
      }
    }

    if (categoryId) {
      searchConditions.categoryIds = {
        has: categoryId,
      }
    }
    const hasSearchConditions = Object.keys(searchConditions).length > 0

    const skip = (parseInt(currentPage) - 1) * parseInt(currentPageSize)
    const take = parseInt(currentPageSize)

    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where: hasSearchConditions ? { AND: [searchConditions] } : {},
        include: {
          category: true,
        },
        skip,
        take,
      }),
      prisma.product.count({
        where: hasSearchConditions ? { AND: [searchConditions] } : {},
      }),
    ])
    return NextResponse.json({
      success: true,
      message: 'Get success',
      data: { products, totalCount },
      error: {},
    })
  } catch (error) {
    console.log('[PRODUCTS_GET]', error)
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

    const body = await req.json()

    const { name, description, price, quantity, isActive, images, categoryId } = body

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

    if (!price) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing value',
          data: {},
          error: {
            field: 'price',
            message: 'Price is required',
          },
        },
        { status: 400 },
      )
    }

    if (!quantity) {
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

    if (!images) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing value',
          data: {},
          error: {
            field: 'images',
            message: 'Images is required',
          },
        },
        { status: 400 },
      )
    }

    let data: any = {
      name,
      description,
      price: Number(price),
      quantity: Number(quantity),
      isActive: Boolean(isActive),
      images,
    }

    if (categoryId) {
      const category = await prisma?.category.findUnique({
        where: {
          id: categoryId,
        },
      })
      if (!category) {
        return NextResponse.json(
          {
            success: false,
            message: 'Category not found',
            data: {},
            error: {
              field: 'categoryId',
              message: 'Category not found',
            },
          },
          { status: 400 },
        )
      } else {
        data.category = {
          connect: {
            id: categoryId,
          },
        }
      }
    }

    const product = await prisma?.product.create({
      data: data,
    })

    return NextResponse.json({
      success: true,
      message: 'Create success',
      data: { product },
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
