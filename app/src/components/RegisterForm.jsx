import { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import clienteAxios from '../config/axios'

const RegisterForm = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [errors, setErrors] = useState({})

  const handleSubmit = async (evt) => {
    evt.preventDefault()

    const err = {}
    if (name.length < 3) {
      err.name = 'Name must be at least 3 characters'
    }
    const validEmail = email.toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
    if (!validEmail) {
      err.email = 'Invalid email'
    }
    if (password.length < 6) {
      err.password = 'Password must be at least 6 characters'
    }
    if (password !== password2) {
      err.password2 = 'Passwords do not match'
    }

    setErrors(err)

    if (Object.keys(err).length > 0) return

    try {
      const newUser = {
        name,
        email,
        password,
        password2
      }

      const { data } = await clienteAxios.post('/register', newUser)
      if (!data.ok) {
        throw new Error(data.message)
      }

      toast.success(data.message)
      setName('')
      setEmail('')
      setPassword('')
      setPassword2('')
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }

  return (
    <form className='ubuntu flex flex-col gap-5' onSubmit={handleSubmit}>
      <Toaster />
      <div className='flex flex-col gap-2 text-sm'>
        <label htmlFor='name'>Name</label>
        <input
          type='text'
          id='name'
          placeholder='John Doe'
          className='py-3 px-4 rounded-xl bg-black bg-opacity-40 outline-none focus:ring-2 focus:ring-cyan-500 shadow-inner shadow-cyan-700'
          onChange={(e) => { setName(e.target.value) }}
          value={name}
        />
        {errors.name && <p className='text-xs text-red-500'>{errors.name}</p>}
      </div>
      <div className='flex flex-col gap-2 text-sm'>
        <label htmlFor='email'>Email</label>
        <input
          type='email'
          id='email'
          placeholder='example@email.com'
          className='py-3 px-4 rounded-xl bg-black bg-opacity-40 outline-none focus:ring-2 focus:ring-cyan-500 shadow-inner shadow-cyan-700'
          onChange={(e) => { setEmail(e.target.value) }}
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
          onChange={(e) => { setPassword(e.target.value) }}
          value={password}
        />
        {errors.password && <p className='text-xs text-red-500'>{errors.password}</p>}
      </div>
      <div className='flex flex-col gap-2 text-sm'>
        <label htmlFor='password2'>Confirm Password</label>
        <input
          type='password'
          id='password2'
          className='py-3 px-4 rounded-xl bg-black bg-opacity-40 outline-none focus:ring-2 focus:ring-cyan-500 shadow-inner shadow-cyan-700'
          onChange={(e) => { setPassword2(e.target.value) }}
          value={password2}
        />
        {errors.password2 && <p className='text-xs text-red-500'>{errors.password2}</p>}
      </div>
      <input
        type='submit'
        value='Register'
        className='py-2 px-10 rounded-xl mx-auto bg-black bg-opacity-50 hover:bg-opacity-100 hover:scale-105 hover:text-cyan-500 cursor-pointer shadow-inner shadow-cyan-500 transition-all duration-300'
      />
    </form>
  )
}

export default RegisterForm
