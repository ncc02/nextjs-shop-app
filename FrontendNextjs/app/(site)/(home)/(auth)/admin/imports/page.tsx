import Importeds from './components/Importeds'

import prisma from '../../../../../libs/prismadb'

const getImports = async ({ page = 1, take = 6 }: { page: number; take: number }) => {
  try {
    const [imports, totalCount] = await Promise.all([
      await prisma.import.findMany({
        take,
        skip: (page - 1) * take,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          product: true,
        },
      }),
      await prisma.import.count({}),
    ])

    return { imports: imports, totalCount }
  } catch (error) {
    return { imports: [], totalCount: 0 }
  }
}

const Home = async () => {
  const data = await getImports({
    page: 1,
    take: 10,
  })

  return <Importeds {...data} />
}

export default Home
