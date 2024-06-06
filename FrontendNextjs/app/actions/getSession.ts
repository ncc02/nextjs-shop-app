import { getServerSession } from 'next-auth'
import { MySession } from '../types'
import { authOptions } from '../utils/authOptions'

const getSession = async (): Promise<MySession | null> => {
  return (await getServerSession(authOptions)) as MySession
}

export default getSession
