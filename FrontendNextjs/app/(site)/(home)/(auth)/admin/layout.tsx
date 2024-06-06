import getSession from '@/app/actions/getSession'
import { redirect } from 'next/navigation'
import SideBar from './components/SideBar'

const Home = async ({ children }: { children: React.ReactNode }) => {
  const session = await getSession()
  if (session?.user?.role !== 'admin') return redirect('/')

  return (
    <div className="w-full min-h-[80vh] flex">
      <SideBar />
      <div className="flex-1 lg:pl-8">{children}</div>
    </div>
  )
}

export default Home
