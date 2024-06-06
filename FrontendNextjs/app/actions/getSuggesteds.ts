import axios from 'axios'
import getSession from './getSession'
import prisma from '../libs/prismadb'
const getSuggesteds = async ({ pageSize }: { pageSize: number }) => {
  try {
    const session = await getSession()
    const productIds = (
      await axios.post<{ count: number; results: string[] }>(`https://cuong.up.railway.app/`, {
        user_id: session?.user?.id,
        page_size: pageSize,
      })
    ).data.results

    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
      },
      include: {
        category: true,
      },
      take: pageSize,
    })
    return products
  } catch (error) {
    return []
  }
}

export default getSuggesteds
