import Link from 'next/link'
import ProductItem from './ProductItem'
import getSuggesteds from '@/app/actions/getSuggesteds'

const Suggesteds = async () => {
  const products = await getSuggesteds({ pageSize: 3 })

  return (
    <div className="px-[2rem] xl:px-[10rem]">
      <div className="flex justify-between text-gray-700">
        <h5 className="text-2xl font-semibold">Maybe you will like</h5>
        <Link className="text-sm hover:text-black underline" href="/products">
          Show All
        </Link>
      </div>
      <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-6 xl:gap-12">
        {products.map(product => (
          <ProductItem product={product} key={product.id} />
        ))}
      </div>
    </div>
  )
}

export default Suggesteds
