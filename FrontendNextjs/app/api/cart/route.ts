import getSession from '@/app/actions/getSession'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const session = await getSession()
    const currentUser = session?.user

    const body = await req.json()

    if (!currentUser?.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { productId, quantity }: { productId: string; quantity: string } = body

    let [product, cart] = await Promise.all([
      await prisma?.product.findUnique({
        where: {
          id: productId,
        },
      }),
      await prisma?.cart.findUnique({
        where: {
          userId: currentUser.id,
        },
      }),
    ])
    if (
      !product ||
      !Number.isInteger(quantity) ||
      product.quantity - product.sold < Number.parseInt(quantity)
    )
      return new NextResponse('Invalid data', { status: 400 })

    if (!cart)
      cart = await prisma?.cart.create({
        data: {
          userId: currentUser.id,
        },
      })
    const cartItem = await prisma?.cartItem.findFirst({
      where: {
        cartId: cart?.id,
        productId,
      },
    })
    if (Number.parseInt(quantity) === 0) {
      await prisma?.cartItem.delete({
        where: {
          id: cartItem?.id,
        },
      })
      return NextResponse.json({ success: true })
    }
    if (!product.isActive) return new NextResponse('Invalid product', { status: 400 })
    
    if (!cartItem) {
      await prisma?.cartItem.create({
        data: {
          quantity: Number.parseInt(quantity),
          productId: productId,
          cartId: cart?.id!,
        },
      })
    } else {
      await prisma?.cartItem.update({
        where: {
          id: cartItem.id,
        },
        data: {
          quantity: Number.parseInt(quantity),
        },
      })
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.log(error)

    return new NextResponse('Internal Error', { status: 500 })
  }
}
