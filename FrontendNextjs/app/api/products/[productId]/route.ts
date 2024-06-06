import { NextResponse } from 'next/server'
import prisma from '../../../libs/prismadb'
import getSession from '@/app/actions/getSession'

export async function PATCH(req: Request, { params }: { params: { productId: string } }) {
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

    const quantityValue = parseInt(quantity, 10)
    const product = await prisma?.product.update({
      where: {
        id: params.productId,
      },
      data: {
        name,
        description,
        price: Number(price),
        quantity: quantityValue,
        isActive: isActive === 'true' ? true : false,
        images,
        category: {
          set: [],
        },
      },
    })

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
      }

      await prisma?.product.update({
        where: {
          id: params.productId,
        },
        data: {
          category: {
            connect: {
              id: categoryId,
            },
          },
        },
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Update success',
      data: { product },
      error: {},
    })
  } catch (error) {
    console.log('[PRODUCTS_PATCH]', error)
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

export async function GET(req: Request, { params }: { params: { productId: string } }) {
  try {
    if (!params.productId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing value',
          data: {},
          error: {
            field: 'productId',
            message: 'Product ID is required',
          },
        },
        { status: 400 },
      )
    }

    const product = await prisma?.product.findUnique({
      where: {
        id: params.productId,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Get success',
      data: { product },
      error: {},
    })
  } catch (error) {
    console.log('[PRODUCT_GET]', error)
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

export async function DELETE(req: Request, { params }: { params: { productId: string } }) {
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
    if (!params.productId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing value',
          data: {},
          error: {
            field: 'productId',
            message: 'Product ID is required',
          },
        },
        { status: 400 },
      )
    }
    const product = await prisma?.product.delete({
      where: {
        id: params.productId,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Delete success',
      data: { product },
      error: {},
    })
  } catch (error) {
    try {
      const product = await prisma.product.findUnique({
        where: { id: params.productId },
      })
      if (product) {
        await prisma.product.update({
          where: {
            id: product.id,
          },
          data: {
            isActive: false,
          },
        })
        return NextResponse.json({
          success: true,
          message: 'Delete success',
          data: { product },
          error: {},
        })
      }
    } catch (error) {}

    console.log('[PRODUCT_DELETE]', error)
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
