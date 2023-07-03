import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LoginForm from '../components/LoginForm'
import RegisterForm from '../components/RegisterForm'
import useAuth from '../hooks/useAuth'

const COMPONENT = {
  LOGIN: 0,
  REGISTER: 1
}
const forms = {
  [COMPONENT.LOGIN]: { id: COMPONENT.LOGIN, title: 'Sign In', label: 'Already have an account?', component: <LoginForm /> },
  [COMPONENT.REGISTER]: { id: COMPONENT.REGISTER, title: 'Sign Up', label: 'Don\'t have an account?', component: <RegisterForm /> }
}

const Auth = () => {
  const [form, setForm] = useState(forms[COMPONENT.LOGIN])
  const { id, title, component } = form

  const { auth } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (auth?.id) {
      navigate('/dashboard')
    }
  }, [auth])

  const renderFormButton = (targetForm) => (
    <button
      className={`hover:underline ${id === targetForm.id && 'hidden'}`}
      onClick={() => setForm(targetForm)}
    >
      {targetForm.label} <span className='text-white font-semibold'>{targetForm.title}</span>
    </button>
  )

  return (
    <div className='text-white flex flex-col gap-10 bg-black/50 backdrop-blur-sm p-10 rounded-xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
      <h2 className='montserrat font-bold text-3xl text-center drop-shadow-md shadow-red-800'>{title}</h2>
      {component}
      <div className='grid gap-3 place-items-center text-white/70'>
        {renderFormButton(forms[COMPONENT.LOGIN])}
        {renderFormButton(forms[COMPONENT.REGISTER])}
      </div>
    </div>
  )
}

export default Auth
