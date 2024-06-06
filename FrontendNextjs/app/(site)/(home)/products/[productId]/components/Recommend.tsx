import getSuggesteds from '@/app/actions/getSuggesteds'
import CardProduct from '../../components/CardProduct'

const Recommend = async () => {
  const products = await getSuggesteds({ pageSize: 4 })
  return (
    <div className="grid grid-cols-4 gap-10">
      {products.map(product => (
        <CardProduct product={product} key={product.id} />
      ))}
    </div>
  )
}

export default Recommend
