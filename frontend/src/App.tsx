import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { GuestRoute, ProtectedRoute } from '~/components/ProtectedRoute'
import RegisterPage from './pages/Register'
import ForgotPasswordPage from './pages/forgot-password'
import GoogleAuthCallbackPage from './pages/google-auth-callback'
import HomePage from './pages/home'
import LoginPage from './pages/login'
import ProfilePage from './pages/profile'
import ResetPasswordPage from './pages/reset-password'
import VerifyOtp from './pages/verify-otp'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path='/'
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <GuestRoute>
              <RegisterPage />
            </GuestRoute>
          }
        />
        <Route
          path='/login'
          element={
            <GuestRoute>
              <LoginPage />
            </GuestRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <GuestRoute>
              <ForgotPasswordPage />
            </GuestRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <GuestRoute>
              <ResetPasswordPage />
            </GuestRoute>
          }
        />
        <Route
          path='/verify-otp'
          element={
            <GuestRoute>
              <VerifyOtp />
            </GuestRoute>
          }
        />
        <Route path='/auth/google/callback' element={<GoogleAuthCallbackPage />} />
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
