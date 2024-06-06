import { ServerPageProps } from '@/app/types'
import getCategories from '@/app/actions/getCategories'
import Categories from './components/Categories'

const Home = async ({ searchParams }: ServerPageProps<any, { take: string; page: string }>) => {
  const data = await getCategories({
    take: Number.parseInt(searchParams?.take || '9') || 9,
    page: Number.parseInt(searchParams?.page || '1') || 1,
  })

  return (
    <>
      <div className="min-h-[calc(100vh-10rem)] relative flex flex-col px-8 w-full gap-y-16">
        <Categories categories={data.categories} totalCount={data.totalCount} />
      </div>
    </>
  )
}

export default Home
