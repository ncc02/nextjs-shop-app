import getSession from './getSession'
import prisma from '../libs/prismadb'
const getCart = async () => {
  try {
    const session = await getSession()
    if (!session?.user?.id) return undefined
    const cart = await prisma.cart.findFirst({
      where: {
        userId: session.user.id,
      },
      include: {
        cartItems: {
          include: {
            product: {
              select: {
                price: true,
              },
            },
          },
        },
      },
    })
    return cart?.cartItems.map(cartItem => ({
      productId: cartItem.productId,
      productPrice: cartItem.product.price,
      quantity: cartItem.quantity,
    }))
  } catch (error) {
    console.log(error)
  }
}

export default getCart
