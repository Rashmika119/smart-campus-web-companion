import { BrowserRouter, Routes, Route } from 'react-router-dom'
import BottomNav from './compnents/BottomNav'
import Dashboard   from './pages/Dashboard'
import Assignments from './pages/Assignments'
import Notes       from './pages/Notes'
import Profile     from './pages/Profile'

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ paddingBottom: 64 }}>
        <Routes>
          <Route path="/"            element={<Dashboard />}   />
          <Route path="/assignments" element={<Assignments />} />
          <Route path="/notes"       element={<Notes />}       />
          <Route path="/profile"     element={<Profile />}     />
        </Routes>
      </div>
      <BottomNav />
    </BrowserRouter>
  )
}