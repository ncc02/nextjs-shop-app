import getSession from '@/app/actions/getSession'
import { NextResponse } from 'next/server'

export async function PUT(req: Request, { params }: { params: { categoryId: string } }) {
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
    const category = await prisma?.category.update({
      where: {
        id: params.categoryId,
      },
      data: {
        name,
        description,
        image,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Update success',
      data: { category },
      error: {},
    })
  } catch (error) {
    console.log('[CATEGORY_PUT]', error)
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
export async function DELETE(req: Request, { params }: { params: { categoryId: string } }) {
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

    if (!params.categoryId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing value',
          data: {},
          error: {
            field: 'CategoryId',
            message: 'Category Id is required',
          },
        },
        { status: 400 },
      )
    }

    const category = await prisma?.category.delete({
      where: {
        id: params.categoryId,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Delete success',
      data: { category },
      error: {},
    })
  } catch (error) {
    console.log('[CATEGORY_DELETE]', error)
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
