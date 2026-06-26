import { NavLink } from 'react-router-dom'
import './BottomNav.css'

const tabs = [
  { path: '/smart-campus-web-companion', icon: '🏠', label: 'Dashboard'  },
  { path: '/smart-campus-web-companion/assignments', icon: '✅', label: 'Assignments' },
  { path: '/smart-campus-web-companion/notes',       icon: '📷', label: 'Notes'       },
  { path: '/smart-campus-web-companion',     icon: '👤', label: 'Profile'     },
]

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      {tabs.map(tab => (
        <NavLink
          key={tab.path}
          to={tab.path}
          end
          className={({ isActive }) => isActive ? 'nav-tab active' : 'nav-tab'}
        >
          <span>{tab.icon}</span>
          <span>{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}