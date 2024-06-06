import getSession from './getSession'

const getOrders = async ({ take = 10, page = 1 }) => {
  try {
    const session = await getSession()
    if (!session?.user?.id)
      return {
        orders: [],
        totalCount: 0,
      }
    const where = {
      ...(session.user.role === 'admin'
        ? {}
        : {
            userId: session.user.id,
          }),
    }
    const [orders, totalCount] = await Promise.all([
      (await prisma?.order.findMany({
        where,
        orderBy: {
          createdAt: 'desc',
        },
        take,
        skip: (page - 1) * take,
        include: {
          orderItems: {
            include: {
              product: true,
            },
          },
          user: true,
        },
      })) || [],
      (await prisma?.order.count({ where })) || 0,
    ])
    return { orders, totalCount }
  } catch (error) {
    return { orders: [], totalCount: 0 }
  }
}

export default getOrders
