import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import BottomNav   from './compnents/BottomNav'
import Dashboard   from './pages/dashboard/Dashboard'
import Assignments from './pages/assignment/Assignments'
import Notes       from './pages/note/Notes'
import Profile     from './pages/profile/Profile'

export default function App() {
  return (
    <BrowserRouter basename="/smart-campus-web-companion">
      <div style={{ paddingBottom: 64 }}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/assignments" element={<Assignments />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
      <BottomNav />
    </BrowserRouter>
  )
}