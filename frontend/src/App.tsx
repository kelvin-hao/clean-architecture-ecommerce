import { BrowserRouter, Routes, Route } from 'react-router-dom'
import RegisterPage from './pages/Register'
import LoginPage from './pages/login'
import VerifyOtp from './pages/verify-otp'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/verify-otp' element={<VerifyOtp />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
