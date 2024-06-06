import getProducts from '@/app/actions/getProducts'
import Products from './components/Products'

const Home = async () => {
  const data = await getProducts({
    take: 10,
    page: 1,
  })
  return <Products {...data} />
}

export default Home
