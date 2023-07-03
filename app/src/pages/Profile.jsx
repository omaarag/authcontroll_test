import useAuth from '../hooks/useAuth'

const Profile = () => {
  const { auth } = useAuth()

  return (
    <>
      <div className='text-white sm:text-lg p-5 sm:p-10 rounded-md bg-black/50 backdrop-blur-md'>
        <h2 className='ubuntu text-center text-3xl sm:text-4xl mb-10'>Profile</h2>
        <div className='mx-auto max-w-fit'>
          <div className='flex gap-5 font-bold'>
            <p className='w-12'>Name:</p>
            <span className='font-normal text-ellipsis overflow-hidden'>{auth?.name}</span>
          </div>
          <div className='flex gap-5 font-bold'>
            <p className='w-12'>Email:</p>
            <span className='font-normal text-ellipsis overflow-hidden'>{auth?.email}</span>
          </div>
          <div className='flex gap-5 font-bold'>
            <p className='w-12'>Role:</p>
            <span className='font-normal text-ellipsis overflow-hidden uppercase'>{auth?.role}</span>
          </div>
        </div>
      </div>
    </>
  )
}
export default Profile
