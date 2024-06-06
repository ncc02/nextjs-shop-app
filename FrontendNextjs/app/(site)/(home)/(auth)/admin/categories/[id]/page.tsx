import getCategory from '@/app/actions/getCategory'
import { ServerPageProps } from '@/app/types'
import Link from 'next/link'
import CategoryForm from './components/CategoryForm'

const Home = async ({ params }: ServerPageProps<{ id: string }, any>) => {
  const category = await getCategory(params?.id as string)

  return (
    <>
      <div className="bg-white px-8 rounded-lg  w-full h-full">
        {category ? (
          <CategoryForm category={category} />
        ) : (
          <div className="p-2">
            <div className="p-2 flex justify-between items-end">
              <h1 className="text-xl pt-6 text-gray-500 font-semibold ">Category Detail</h1>
            </div>
            <div className="w-full mb-3">
              <div className="m-2 h-full">
                <div className="border rounded-lg h-full p-12">
                  <div className="flex flex-col items-center justify-center h-full">
                    <h2 className="mb-3 text-2xl ">Category Not Found</h2>
                    <Link
                      href={'/admin/categories/add'}
                      className={
                        'ml-2 text-white bg-blue-700 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center '
                      }
                    >
                      Add Category
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default Home
