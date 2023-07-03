import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import useAuth from '../hooks/useAuth'

const Dashboard = () => {
  const { auth, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!auth.id) {
      navigate('/')
    }
  }, [auth])

  return (
    <div>
      <nav className='montserrat bg-black/50 backdrop-blur-md text-white text-sm font-semibold fixed top-0 left-0 right-0 flex justify-end items-center'>
        <Link to='/dashboard' className='uppercase px-4 py-2 sm:px-6 sm:py-4 hover:text-cyan-500 transition-colors duration-300'>Home</Link>
        <button onClick={logout} className='uppercase px-4 py-2 sm:px-6 sm:py-4 hover:text-cyan-500 transition-colors duration-300'>Logout</button>
      </nav>
      <main className='mt-12 sm:mt-20 mx-auto max-w-screen-md'>
        <Outlet />
      </main>
    </div>
  )
}
export default Dashboard
