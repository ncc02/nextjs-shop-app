import getCurrentUser from '@/app/actions/getCurrentUser'
import InfoForm from './components/InfoForm'
import PasswordForm from './components/PasswordForm'

const Home = async () => {
  const user = await getCurrentUser()
  return (
    <>
      <InfoForm user={user!} />
      <PasswordForm />
    </>
  )
}

export default Home
