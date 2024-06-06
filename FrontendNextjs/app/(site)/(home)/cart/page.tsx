import getCart from '@/app/actions/getCart'
import Cart from './components/Cart'
import Button from '../../components/Button'
import Link from 'next/link'
import getCurrentUser from '@/app/actions/getCurrentUser'

const Home = async () => {
  const [cart, currentUser] = await Promise.all([await getCart(), await getCurrentUser()])
  
  return (
    <div className="min-h-[calc(64vh)] px-[2rem] xl:px-[10rem]">
      <h5 className="text-2xl font-semibold text-gray-700">Cart</h5>
      <div className="flex gap-y-2">
        <Cart cartData={cart} user={currentUser} />
      </div>
      <div className="w-full bg-slate-200 p-10 flex rounded-md mt-20 justify-between items-center">
        <div className="">
          <h4 className="text-3xl mb-3">Continue shopping</h4>
          <p>
            Discover more products that are perfect for gift, for your wardrobe, or a unique addtion
            to your collection
          </p>
        </div>
        <div>
          <Button>
            <Link href={'/products'}>Continue shopping</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Home
