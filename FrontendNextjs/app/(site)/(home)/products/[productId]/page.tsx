import { Suspense } from 'react'
import { getProduct } from '../actions'
import ProductInfo from './components/ProductInfo'
import Recommend from './components/Recommend'

const ProductPage = async ({ params }: { params: { productId: string } }) => {
  const data = await getProduct(
    params.productId.length < 24 ? '111111111111111111111111' : params.productId,
  )

  return (
    <div className="bg-white">
      <div className="">
        <ProductInfo product={data} category={data.category} />
        <div className="flex flex-col gap-4 px-2 lg:px-14 py-14">
          <div>
            <span className=" text-violet-600 font-semibold text-xl">You may also like</span>
          </div>
          <Suspense fallback={<div className='h-20'></div>}>
            <Recommend />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

export default ProductPage
