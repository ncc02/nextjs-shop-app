import getSession from '@/app/actions/getSession'
import { NextResponse } from 'next/server'
import prisma from '../../libs/prismadb'
import getCurrentUser from '@/app/actions/getCurrentUser'


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

    const {searchParams} = new URL(req.url);
    const pageSize = searchParams.get("pageSize");
    const page = searchParams.get("page");
    const currentPage = page ? page : "1";
    const currentPageSize = pageSize? pageSize : "10";

    const skip = (parseInt(currentPage) - 1) * parseInt(currentPageSize);
    const take = parseInt(currentPageSize);
    const [orders,totalCount] = await Promise.all([
      prisma.order.findMany({
        where: {
          userId: currentUser?.id,
        },
        include: {
          orderItems: {
            include: {
              product: true,
            },
          },
        },
        skip,
        take,
      }),
      prisma.order.count({
        where: {
          userId: currentUser?.id,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: 'Get success',
      data: { orders, totalCount},
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

const errorResponse = (message: string, status: number) =>
  NextResponse.json(
    {
      success: false,
      message,
      data: {},
      error: {
        message,
      },
    },
    { status },
  )

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser?.id) {
      return errorResponse('Unauthorized', 401)
    }

    let cart = await prisma?.cart.findUnique({
      where: {
        userId: currentUser.id,
      },
    })

    const cartItem = await prisma?.cartItem.findMany({
      where: {
        cartId: cart?.id,
      },
      include: {
        product: true,
      },
    })
    if (cartItem && cartItem.length > 0) {
      const order = await prisma?.order.create({
        data: {
          userId: currentUser.id,
          phone: currentUser.phoneNumber || '',
          address: currentUser.address || '',
        },
      })
      if (order)
        await Promise.all(
          cartItem.map(async item => {
            await prisma?.orderItem.create({
              data: {
                orderId: order.id,
                productId: item.productId,
                quantity: item.quantity,
                price: item.product.price || 0,
              },
            })

            await prisma?.product.update({
              where: {
                id: item.productId,
              },
              data: {
                sold: {
                  increment: item.quantity,
                },
              },
            })
          }),
        )
      else {
        return errorResponse('Internal error', 500)
      }

      await prisma?.cartItem.deleteMany({
        where: {
          cartId: cart?.id,
        },
      })

      return NextResponse.json(
        {
          success: true,
          message: 'Success',
          data: {...order},
          error: {},
        },
        { status: 200 },
      )
    } else return errorResponse('Internal error', 500)
  } catch (error) {
    console.log('[Order]', error)
    return errorResponse('Internal error', 500)
  }
}
