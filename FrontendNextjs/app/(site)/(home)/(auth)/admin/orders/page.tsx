import getOrders from '@/app/actions/getOrders'
import OrderListView from './components/OrderList'
import { ServerPageProps } from '@/app/types'

const Home = async ({ searchParams }: ServerPageProps<any, { page: string; take: string }>) => {
  const data = await getOrders({
    page: Number.parseInt(searchParams?.page || '1') || 1,
    take: Number.parseInt(searchParams?.take || '6') || 6,
  })
  return (
    <div>
      {/* List Order  Wrapper*/}
      <div className="rounded-xl p-2 bg-white text-slate-700">
        {/* Order Wrapper */}
        {data.orders.length > 0 ? (
          <OrderListView orders={data.orders} totalCount={data.totalCount} />
        ) : (
          <div>Empty</div>
        )}
      </div>
    </div>
  )
}

export default Home
