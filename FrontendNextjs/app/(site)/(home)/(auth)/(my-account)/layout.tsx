import getSession from '@/app/actions/getSession'
import Sidebar from './components/Sidebar'

const Home = async ({ children }: { children: React.ReactNode }) => {
  const session = await getSession()

  return (
    <div className="min-h-[calc(100vh-10rem)] relative flex">
      <Sidebar user={session?.user!} />
      <div className="px-8 flex-1">{children}</div>
    </div>
  )
}

export default Home
