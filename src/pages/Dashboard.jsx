import { useState, useEffect } from 'react'
import schedule from '../data/schedule.json'
import './Dashboard.css'

export default function Dashboard() {

  // --- greeting based on time of day ---
  function getGreeting() {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  // --- get today's day name e.g. "Wednesday" ---
  function getTodayName() {
    return new Date().toLocaleDateString('en-US', { weekday: 'long' })
  }

  // --- get today's full date e.g. "Wednesday · June 3, 2026" ---
  function getTodayFull() {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  // --- filter lectures to only show today's ---
  const todayLectures = schedule.filter(
    lecture => lecture.day === getTodayName()
  )

  // --- load profile name from localStorage ---
  const savedProfile = JSON.parse(localStorage.getItem('sc_profile') || '{}')
  const firstName = savedProfile.name
    ? savedProfile.name.trim().split(' ')[0]
    : 'Student'

  // --- load assignments from localStorage for stats ---
  const assignments = JSON.parse(localStorage.getItem('sc_assignments') || '[]')
  const pendingCount = assignments.filter(a => !a.done).length

  return (
    <div className="dashboard">

      {/* header */}
      <div className="dashboard-header">
        <h1>{getGreeting()}, {firstName}</h1>
        <p>{getTodayFull()}</p>
      </div>

      {/* stats row */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="value">{todayLectures.length}</div>
          <div className="label">Lectures today</div>
        </div>
        <div className="stat-card">
          <div className="value">{pendingCount}</div>
          <div className="label">Assignments pending</div>
        </div>
      </div>

      {/* today's lectures */}
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

      {/* announcements section — filled in step 4 */}
      <Announcements />

    </div>
  )
}