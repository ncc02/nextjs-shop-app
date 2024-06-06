import getCategories from '@/app/actions/getCategories'
import Categories from './components/Categories'

const Home = async () => {
  const data = await getCategories({
    take: 10,
  })
  return <Categories {...data}/>
}

export default Home
