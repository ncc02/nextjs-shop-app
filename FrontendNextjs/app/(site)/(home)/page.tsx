import getCategories from '@/app/actions/getCategories'
import Button from '../components/Button'
import Categories from './components/Categories'
import Products from './components/Products'
import { ServerPageProps } from '@/app/types'
import getProducts from '@/app/actions/getProducts'
import Link from 'next/link'
import Suggesteds from './components/Suggesteds'
import { Suspense } from 'react'

const Home = async ({
  searchParams,
}: ServerPageProps<
  any,
  {
    page: string
  }
>) => {
  const page = Number(searchParams?.page || 1) <= 0 ? 1 : Number(searchParams?.page || 1)

  const [categories, products] = await Promise.all([
    await getCategories({ take: 6 }),
    await getProducts({ page, take: 6 }),
  ])

  return (
    <div className="min-h-[calc(100vh-10rem)] relative flex flex-col px-8 w-full gap-y-16">
      <div className="bg-[url('/images/home.png')] w-full bg-no-repeat bg-contain rounded-md bg-gray-200 p-[8rem]">
        <h1 className="text-5xl font-bold w-1/2 text-ellipsis font-serif mb-[2rem] mt-[4rem]">
          Discover many products to suit your needs.
        </h1>
        <Button>
          <Link href="/products">Shop now</Link>
        </Button>
      </div>
      <Suspense fallback={<div></div>}>
        <Suggesteds />
      </Suspense>
      <Categories categories={categories.categories} />
      <Products products={products.products} max={Math.ceil(products.totalCount / 6)} page={page} />
    </div>
  )
}

export default Home
