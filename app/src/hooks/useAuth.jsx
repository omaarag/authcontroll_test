import { useContext } from 'react'
import { AuthContext } from '../context/AuthProvider'
import { redirect } from 'react-router-dom'

const useAuth = () => {
  const { auth, setAuth } = useContext(AuthContext)

  const logout = () => {
    setAuth({})
    localStorage.removeItem('token')
    redirect('/')
  }

  return {
    auth,
    setAuth,
    logout
  }
}

export default useAuth
