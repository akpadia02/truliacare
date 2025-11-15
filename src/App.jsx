import { Routes, Route } from 'react-router-dom'
import RoleSelection from './pages/RoleSelection'
import EmployeeLogin from './pages/EmployeeLogin'
import EmployeeSignup from './pages/EmployeeSignup'
import AdminLogin from './pages/AdminLogin'
import AdminSignup from './pages/AdminSignup'
import EmployeeDashboard from './pages/EmployeeDashboard'
import AdminDashboard from './pages/AdminDashboard'

function App() {
  return (
    <Routes>
      <Route path="/" element={<RoleSelection />} />
      <Route path="/employee/login" element={<EmployeeLogin />} />
      <Route path="/employee/signup" element={<EmployeeSignup />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/signup" element={<AdminSignup />} />
      <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
    </Routes>
  )
}

export default App

