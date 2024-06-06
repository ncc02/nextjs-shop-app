import { ServerPageProps } from '@/app/types'
import Link from 'next/link'
import ImportForm from './components/ImportForm'
import Importeds from './components/Importeds'

const getImportOfProduct = async (productId: string) => {
  try {
    const imports = await prisma?.import.findMany({
      where: {
        productId,
      },
      take: 10,
      orderBy: {
        createdAt: 'desc',
      },
    })
    return imports
  } catch (error) {
    return undefined
  }
}
const getProduct = async (productId: string) => {
  try {
    const product = await prisma?.product.findUnique({
      where: {
        id: productId,
      },
    })
    return product
  } catch (error) {
    return undefined
  }
}
const Home = async ({ params }: ServerPageProps<{ productId: string }>) => {
  const [imports, product] = await Promise.all([
    await getImportOfProduct(params?.productId!),
    await getProduct(params?.productId!),
  ])
  return (
    <>
      <div className="bg-white px-8 rounded-lg  w-full h-full">
        <div className="p-2">
          <div className="p-2 mt-5 flex justify-between items-end">
            <h1 className="text-xl text-gray-500 font-semibold ">Import product</h1>
          </div>
          <div className="">
            <div className="flex flex-wrap ">
              {!product ? (
                <div className="w-full mb-3">
                  <div className="m-2 h-full">
                    <div className="border rounded-lg h-full p-12">
                      <div className="flex flex-col items-center justify-center h-full">
                        <h2 className="mb-3 text-2xl ">Product Not Found</h2>
                        <Link
                          href="/admin/products/add-product"
                          className={
                            'ml-2 text-white bg-blue-700 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center '
                          }
                        >
                          Add Product
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <ImportForm product={product} />
                  <Importeds imports={imports} />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home
