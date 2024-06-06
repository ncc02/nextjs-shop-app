import getOrders from '@/app/actions/getOrders'
import OrderListView from './components/OrderListView'

const Home = async () => {
  const data = await getOrders({ take: 5 })
  return (
    <div>
      {/* List Order  Wrapper*/}
      <div className="rounded-xl p-2 bg-white text-slate-700">
        <div className="mt-2">
          <h3 className={`px-3 text-2xl font-bold`}>Order History</h3>
          <p className={`mb-3 pl-3 text-sm text-slate-500 font-medium`}>
            Track and manage your orders
          </p>
        </div>
        {/* Order Wrapper */}
        {data?.orders && data?.orders.length > 0 ? (
          <OrderListView orders={data.orders} totalCount={data.totalCount} />
        ) : (
          <div className="flex justify-center items-center">
            <div className={`py-8 my-3 text-lg font-bold text-slate-700`}>No orders found</div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home
