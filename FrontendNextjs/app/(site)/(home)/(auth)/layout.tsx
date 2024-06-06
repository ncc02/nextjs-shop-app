import getSession from '@/app/actions/getSession'
import { redirect } from 'next/navigation'

const Home = async ({ children }: { children: React.ReactNode }) => {
  const session = await getSession()
  if (!session?.user) redirect('/')

  return <>{children}</>
}

export default Home
