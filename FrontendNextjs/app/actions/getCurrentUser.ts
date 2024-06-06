import getSession from './getSession'
import prisma from '../libs/prismadb'

const getCurrentUser = async () => {
  try {
    const session = await getSession()
    if (!session?.user?.email) return null

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email as string },
      select: {
        hashedPassword: false,
        address: true,
        birthDate: true,
        createdAt: true,
        email: true,
        id: true,
        name: true,
        role: true,
        phoneNumber: true,
        image: true,
      },
    })

    if (!currentUser) return null
    return currentUser
  } catch (error) {}
}

export default getCurrentUser
