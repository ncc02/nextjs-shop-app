import Header from './components/Header'
import Footer from './components/Footer'
import getSession from '@/app/actions/getSession'
import getCart from '@/app/actions/getCart'

const Home = async ({ children }: { children: React.ReactNode }) => {
  const [session, cart] = await Promise.all([await getSession(), await getCart()])

  return (
    <div className="flex min-h-full flex-col bg-gray-100">
      <Header user={session?.user} cartItems={cart} />
      <main className="h-auto relative m-8">{children}</main>
      <Footer />
    </div>
  )
}

export default Home
