import Link from 'next/link'
import getSession from '../../actions/getSession'
import { redirect } from 'next/navigation'
import Image from 'next/image'

const Home = async ({ children }: { children: React.ReactNode }) => {
  const session = await getSession()
  if (session?.user) redirect('/')

  return (
    <main className="flex min-h-full w-full bg-gray-100 px-0">
      <div className="hidden lg:block w-7/12 relative">
        <Image src="/images/login.jpg" alt="Image" fill className="object-cover" />
      </div>
      <div className="w-full lg:w-5/12 flex flex-col justify-center bg-gray-100 px-12 sm:px-24 md:px-48 lg:px-12">
        <Link href="/">
          <h1 className="text-3xl font-bold text-sky-600 mb-4">Shop app</h1>
        </Link>
        {children}
      </div>
    </main>
  )
}

export default Home
