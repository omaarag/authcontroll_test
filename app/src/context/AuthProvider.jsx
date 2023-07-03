import { PropTypes } from 'prop-types'
import { createContext, useEffect, useState } from 'react'
import clienteAxios from '../config/axios'

export const AuthContext = createContext()

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({})

  useEffect(() => {
    const autenticarUsuario = async () => {
      const token = window.localStorage.getItem('token')
      if (!token) {
        return
      }
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }

      try {
        const { data } = await clienteAxios.get('/auth', config)
        setAuth(data)
      } catch (error) {
        setAuth({})
      }
    }
    autenticarUsuario()
  }, [])

  return (
    <AuthContext.Provider value={{
      auth, setAuth
    }}
    >
      {children}
    </AuthContext.Provider>
  )
}

AuthProvider.propTypes = {
  children: PropTypes.node
}

export default AuthProvider
