import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import useAuth from '../hooks/useAuth'
import clienteAxios from '../config/axios'

const LoginForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})

  const { setAuth } = useAuth()

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    const err = {}
    if (!email) {
      err.email = 'Email is required'
    }
    if (!password) {
      err.password = 'Password is required'
    }

    setErrors(err)

    if (Object.keys(err).length > 0) return

    const user = { email, password }

    try {
      const { data } = await clienteAxios.post('/login', user)

      if (!data.ok) {
        throw new Error(data.message)
      }

      window.localStorage.setItem('token', data.user.jwt)
      setAuth(data.user)
      navigate('/dashboard')
      toast.success('Login Successful')
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }

  return (
    <form className='ubuntu flex flex-col gap-5' onSubmit={handleSubmit}>
      <Toaster />
      <div className='flex flex-col gap-2 text-sm'>
        <label htmlFor='email'>Email</label>
        <input
          type='email'
          id='email'
          placeholder='example@email.com'
          className='py-3 px-4 rounded-xl bg-black bg-opacity-40 outline-none focus:ring-2 focus:ring-cyan-500 shadow-inner shadow-cyan-700'
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        {errors.email && <p className='text-xs text-red-500'>{errors.email}</p>}
      </div>
      <div className='flex flex-col gap-2 text-sm'>
        <label htmlFor='password'>Password</label>
        <input
          type='password'
          id='password'
          className='py-3 px-4 rounded-xl bg-black bg-opacity-40 outline-none focus:ring-2 focus:ring-cyan-500 shadow-inner shadow-cyan-700'
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
        {errors.password && <p className='text-xs text-red-500'>{errors.password}</p>}
      </div>
      <input
        type='submit'
        value='Login'
        className='py-2 px-10 rounded-xl mx-auto bg-black bg-opacity-50 hover:bg-opacity-100 hover:scale-105 hover:text-cyan-500 cursor-pointer shadow-inner shadow-cyan-500 transition-all duration-300'
      />
    </form>
  )
}
export default LoginForm
