import prisma from '../libs/prismadb'

const getProducts = async ({ page = 1, take = 6 }: { page: number; take: number }) => {
  try {
    const [products, count] = await Promise.all([
      await prisma.product.findMany({
        where: {
          isActive: true,
          quantity: {
            gt: prisma.product.fields.sold,
          },
        },
        take,
        skip: (page - 1) * take,
      }),
      await prisma.product.count({
        where: {
          isActive: true,
          quantity: {
            gt: prisma.product.fields.sold,
          },
        },
      }),
    ])

    return { products: products, totalCount: count }
  } catch (error) {
    return { products: [], totalCount: 0 }
  }
}

export default getProducts
