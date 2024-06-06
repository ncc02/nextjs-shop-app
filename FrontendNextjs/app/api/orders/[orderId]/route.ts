import getSession from '@/app/actions/getSession'
import { NextResponse } from 'next/server'
import prisma from '@/app/libs/prismadb'
import getCurrentUser from '@/app/actions/getCurrentUser'


export async function GET(req: Request,  { params } : { params: {orderId: string }}) {
  try {
    const session = await getSession()
    const currentUser = session?.user
    if (!params.orderId) {
        return NextResponse.json({
            "success": false,
            "message": "Missing value",
            "data": {},
            "error": {
                "field":'productId',
                "message":'Product ID is required'
            }
        }, {status: 400})
    };
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

    const orders = await prisma.order.findUnique({
      where: {
        id: params.orderId
      },
      include: {
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
      data: { ...orders },
      error: {},
    })
  } catch (error) {
    console.log('[ORDER_GET]', error)
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
export async function PATCH(
  req: Request,
  { params } : { params: {orderId: string }}
) {
  try {

      const session = await getSession()
      const currentUser = session?.user

      if (!currentUser?.id || currentUser.role != "admin") {
          return NextResponse.json({
              "success": false,
              "message": "Unauthorized",
              "data": {},
              "error": {
                  "message":'Unauthorized'
              }
          }, {status: 401})
      }
      await prisma.order.update({
        where:{
          id:params.orderId
        },
        data: {
          status: "Canceled"
        }
      })
      return NextResponse.json({
        "success": true,
        "message": "Update success",
        "data": {},
        "error": {}
    });

    } catch (error) {
      console.log('[ORDER_GET]', error)
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