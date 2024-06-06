import prisma from '../libs/prismadb'

const getCategories = async ({ take = 6, page = 1 }: { take?: number; page?: number }) => {
  try {
    const [categories, count] = await Promise.all([
      await prisma.category.findMany({
        where: {},
        take,
        skip: (page - 1) * take,
        orderBy: {
          name: 'asc',
        },
      }),
      await prisma.category.count({
        where: {},
      }),
    ])
    return { categories, totalCount: count }
  } catch (error) {
    return { categories: [], totalCount: 0 }
  }
}

export default getCategories
