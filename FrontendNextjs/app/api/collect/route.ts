import getSession from '@/app/actions/getSession'
import { NextResponse } from 'next/server'

type TypeCollect = 'Care' | 'Cart' | 'Buy'
const mapType: {
  Care: 'recentCare'
  Cart: 'recentAdd'
  Buy: 'recentBuy'
} = {
  Care: 'recentCare',
  Cart: 'recentAdd',
  Buy: 'recentBuy',
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
    const { type, productId }: { type: TypeCollect; productId: string } = body
    if (!type || (type !== 'Buy' && type !== 'Care' && type !== 'Cart'))
      return NextResponse.json(
        {
          success: false,
          message: 'Missing value',
          data: {},
          error: {
            field: 'type',
            message: 'Type is required',
          },
        },
        { status: 400 },
      )
    if (!productId)
      return NextResponse.json(
        {
          success: false,
          message: 'Missing value',
          data: {},
          error: {
            field: 'ProductId',
            message: 'ProductId is required',
          },
        },
        { status: 400 },
      )
    const [product, collected] = await Promise.all([
      await prisma?.product.findUnique({ where: { id: productId } }),
      await prisma?.userData.findUnique({ where: { userId: currentUser.id } }),
    ])
    if (!product)
      return NextResponse.json(
        {
          success: false,
          message: 'Not found',
          data: {},
          error: {
            message: 'Product is not found',
          },
        },
        { status: 404 },
      )
    if (!collected) {
      await prisma?.userData.create({
        data: {
          userId: currentUser.id,
          [mapType[type]]: [productId],
        },
      })
      return NextResponse.json({
        success: true,
        message: 'Success',
      })
    }
    const updated = await prisma?.userData.update({
      where: { userId: currentUser.id },
      data: {
        [mapType[type]]: [productId, ...collected[mapType[type]].filter(id => id !== productId)],
      },
    })
    return NextResponse.json({
      success: true,
      message: 'Success',
      data: { updated },
    })
  } catch (error) {
    console.log('[CollectData]', error)
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
