import { getCategorys, searchProducts } from './actions'
import ProductList from './components/ProductsList'

const getProducts = async (searchParams: { [key: string]: string | null | undefined }) => {
  const condition = {
    name: searchParams.name,
    minPrice: searchParams.minPrice ? parseInt(searchParams.minPrice) : undefined,
    maxPrice: searchParams.maxPrice ? parseInt(searchParams.maxPrice) : undefined,
    categoryId: searchParams.categoryId,
    page: searchParams.page ? parseInt(searchParams.page) : undefined,
    pageSize: searchParams.pageSize ? parseInt(searchParams.pageSize) : undefined,
    orderBy: searchParams.orderBy,
  }
  return await searchProducts(condition)
}

const Products = async ({
  searchParams,
}: {
  params: { slug: string }
  searchParams: { [key: string]: string | null | undefined }
}) => {
  const [products, categorys] = await Promise.all([
    await getProducts(searchParams),
    await getCategorys(),
  ])
  return (
    <>
      <div className="max-w-container mx-auto px-4">
        <ProductList
          products={products.products}
          totalCount={products.totalCount}
          categorys={categorys}
        />
      </div>
    </>
  )
}

export default Products
