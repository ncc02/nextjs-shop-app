import prisma from '../libs/prismadb'

const getCategory = async (id: string) => {
  try {
    const category = await prisma.category.findUnique({
      where: {
        id,
      },
    })
    return category
  } catch (error) {
    return null
  }
}

export default getCategory
