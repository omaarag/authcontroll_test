import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className='text-center'>
      <h2 className='text-7xl text-black font-bold montserrat text-shadow-white'>Not Found</h2>
      <Link
        to='/'
        className='block bg-black bg-opacity-50 hover:bg-opacity-100 py-2 px-4 mt-10 mx-auto w-60 rounded-xl shadow-inner shadow-white text-white font-bold transition-colors duration-100'
      >
        Return to Home
      </Link>
    </div>
  )
}
export default NotFound
