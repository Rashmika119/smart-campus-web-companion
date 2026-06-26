import { BrowserRouter, Routes, Route } from 'react-router-dom'
import BottomNav from './compnents/BottomNav'
import Dashboard   from './pages/dashboard/Dashboard'
import Assignments from './pages/assignment/Assignments'
import Notes       from './pages/note/Notes'
import Profile     from './pages/profile/Profile'

export default function App() {
  return (
    <BrowserRouter basename="/">
      <div style={{ paddingBottom: 64 }}>
        <Routes>
          <Route path="/smart-campus-web-companion" element={<Dashboard />}   />
          <Route path="/smart-campus-web-companion/assignments" element={<Assignments />} />
          <Route path="/smart-campus-web-companion/notes"       element={<Notes />}       />
          <Route path="/smart-campus-web-companion/profile"     element={<Profile />}     />
        </Routes>
      </div>
      <BottomNav />
    </BrowserRouter>
  )
}