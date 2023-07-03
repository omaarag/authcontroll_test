import { Routes, Route, BrowserRouter } from 'react-router-dom'
import Auth from './pages/Auth'
import Confirm from './pages/Confirm'
import Dashboard from './layouts/Dashboard'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'
import AuthProvider from './context/AuthProvider'

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Auth />} />
          <Route path='/confirm/:token' element={<Confirm />} />
          <Route path='/dashboard' element={<Dashboard />}>
            <Route index element={<Profile />} />
          </Route>
          <Route path='*' element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
export default App
