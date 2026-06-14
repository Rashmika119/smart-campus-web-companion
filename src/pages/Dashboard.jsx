import { useState, useEffect } from 'react'
import schedule from '../data/schedule.json'
import './Dashboard.css'
import { getAllNotes } from '../db'

// ✅ Announcements defined FIRST in same file
function Announcements() {
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)


  async function fetchData() {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(
        'https://jsonplaceholder.typicode.com/posts?_limit=4'
      )
      if (!response.ok) throw new Error('Server error: ' + response.status)
      const data = await response.json()
      setAnnouncements(data)
    } catch (err) {
      setError('Could not load announcements. Check your connection.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])



  return (
    <div>
      <div className="section-title">
        <span className="live-dot"></span>
        Campus announcements · live
      </div>
      {loading && (
        <div className="loading-text">Loading announcements...</div>
      )}
      {error && !loading && (
        <div className="error-box">
          <p>{error}</p>
          <button className="retry-btn" onClick={fetchData}>Retry</button>
        </div>
      )}
      {!loading && !error && announcements.map(ann => (
        <div className="ann-card" key={ann.id}>
          <h3>{ann.title}</h3>
          <p>{ann.body}</p>
        </div>
      ))}
    </div>
  )
}

// ✅ Dashboard comes AFTER so it can see Announcements above
export default function Dashboard() {

  const [notesCount, setNotesCount] = useState(0)

  function getGreeting() {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  function getTodayName() {
    return new Date().toLocaleDateString('en-US', { weekday: 'long' })
  }

  function getTodayFull() {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const todayLectures = schedule.filter(
    lecture => lecture.day === getTodayName()
  )

  const savedProfile = JSON.parse(localStorage.getItem('sc_profile') || '{}')
  const firstName = savedProfile.name
    ? savedProfile.name.trim().split(' ')[0]
    : 'Student'

  const assignments = JSON.parse(localStorage.getItem('sc_assignments') || '[]')
  const pendingCount = assignments.filter(a => !a.done).length

  useEffect(() => {
    getAllNotes().then(notes => setNotesCount(notes.length))
  }, [])

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>{getGreeting()}, {firstName}</h1>
        <p>{getTodayFull()}</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="value">{todayLectures.length}</div>
          <div className="label">Lectures today</div>
        </div>
        <div className="stat-card">
          <div className="value">{pendingCount}</div>
          <div className="label">Assignments pending</div>
        </div>
        <div className="stat-card">
          <div className="value">{notesCount}</div>
          <div className="label">Notes saved</div>
        </div>
      </div>

      <div className="section-title">Today's lectures</div>

      {todayLectures.length === 0 ? (
        <div className="no-lectures">
          No lectures today — enjoy your day!
        </div>
      ) : (
        todayLectures.map(lecture => (
          <div className="lecture-card" key={lecture.id}>
            <span className="lecture-time">{lecture.time}</span>
            <div className="lecture-info">
              <h3>{lecture.subject}</h3>
              <p>{lecture.room} · {lecture.lecturer}</p>
            </div>
          </div>
        ))
      )}

      <Announcements />
    </div>
  )
}