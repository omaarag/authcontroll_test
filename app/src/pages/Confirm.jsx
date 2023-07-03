import { Link, useParams } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'
import { useEffect, useState } from 'react'
import clienteAxios from '../config/axios'

const Confirm = () => {
  const [ok, setOk] = useState(null)
  const token = useParams().token

  const activate = async () => {
    try {
      const { data } = await clienteAxios.get(`/confirm/${token}`)
      if (!data.ok) {
        throw new Error(data.message)
      }
      toast.success(data.message)
      setOk(true)
    } catch (error) {
      setOk(false)
    }
  }

  useEffect(() => {
    activate()
  }, [])

  return (
    <div className='text-white flex flex-col gap-10 bg-black/30 backdrop-blur-sm p-10 rounded-xl'>
      <Toaster />
      <h2 className='montserrat font-bold text-3xl text-center drop-shadow-md shadow-red-800'>Confirm your account</h2>
      {
        ok !== null &&
          <p className='text-center'>{ok ? 'Your account has been activated' : 'Something went wrong'}</p>
      }
      <Link
        to='/'
        className='py-2 px-10 rounded-xl mx-auto bg-black bg-opacity-50 hover:bg-opacity-100 hover:scale-105 hover:text-cyan-500 cursor-pointer shadow-inner shadow-cyan-500 transition-all duration-300'
      >
        Go to home page
      </Link>
    </div>
  )
}

export default Confirm
