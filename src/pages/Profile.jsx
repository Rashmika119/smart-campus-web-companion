import { useState, useEffect, useRef } from 'react'
import './Profile.css'

const DEFAULT_PROFILE = {
  name: '',
  regNumber: '',
  year: '',
  credits: 0,
}

export default function Profile() {

  // load saved profile on first render
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('sc_profile')
    return saved ? JSON.parse(saved) : DEFAULT_PROFILE
  })

  const [saveStatus, setSaveStatus] = useState('')
  const debounceTimer = useRef(null)

  // debounced auto-save — saves 1 second after user stops typing
  // useEffect(() => {
  //   setSaveStatus('saving')
  //   clearTimeout(debounceTimer.current)

  //   debounceTimer.current = setTimeout(() => {
  //     localStorage.setItem('sc_profile', JSON.stringify(profile))
  //     setSaveStatus('saved')
  //     setTimeout(() => setSaveStatus(''), 2000)
  //   }, 1000)

  //   return () => clearTimeout(debounceTimer.current)
  // }, [profile])

  // single handler for all inputs
  function handleChange(e) {
    const { name, value } = e.target
    setProfile(prev => ({ ...prev, [name]: value }))
  }

  function handleSave() {
    localStorage.setItem('sc_profile', JSON.stringify(profile))
    setSaveStatus('saved')
    setTimeout(() => setSaveStatus(''), 2000)
  }

  // get initials from name
  function getInitials(name) {
    const parts = name.trim().split(' ').filter(Boolean)
    if (parts.length >= 2) return parts[0][0] + parts[parts.length - 1][0]
    return parts[0]?.[0] || '?'
  }

  // get assignment stats from localStorage
  const assignments = JSON.parse(localStorage.getItem('sc_assignments') || '[]')
  const doneCount    = assignments.filter(a =>  a.done).length
  const pendingCount = assignments.filter(a => !a.done).length

  const creditPercent = Math.min(
    Math.round((Number(profile.credits) / 120) * 100),
    100
  )

  return (
    <div className="profile-page page-container">

      <h1>Profile</h1>
      <p>Your academic details</p>

      {/* avatar */}
      <div className="avatar">
        {profile.name ? getInitials(profile.name).toUpperCase() : '?'}
      </div>

      {/* auto-save status */}
      <div className={`save-status ${saveStatus}`}>
        {saveStatus === 'saving' && '● Saving...'}
        {saveStatus === 'saved'  && '✓ Saved'}
      </div>

      {/* assignment stats pulled from localStorage */}
      <div className="profile-stats">
        <div className="profile-stat-card">
          <div className="value">{doneCount}</div>
          <div className="label">Assignments done</div>
        </div>
        <div className="profile-stat-card">
          <div className="value">{pendingCount}</div>
          <div className="label">Pending tasks</div>
        </div>
      </div>

      {/* form fields */}
      <div className="form-group">
        <label>Full name</label>
        <input
          name="name"
          value={profile.name}
          onChange={handleChange}
          placeholder="e.g. Ashan Perera"
        />
      </div>

      <div className="form-group">
        <label>Registration number</label>
        <input
          name="regNumber"
          value={profile.regNumber}
          onChange={handleChange}
          placeholder="e.g. SE/2021/047"
        />
      </div>

      <div className="form-group">
        <label>Year of study</label>
        <select name="year" value={profile.year} onChange={handleChange}>
          <option value="">Select year</option>
          <option>1st Year</option>
          <option>2nd Year</option>
          <option>3rd Year</option>
          <option>4th Year</option>
        </select>
      </div>

      <div className="form-group">
        <label>Completed credits (out of 120)</label>
        <input
          name="credits"
          type="number"
          min="0"
          max="120"
          value={profile.credits}
          onChange={handleChange}
          placeholder="e.g. 72"
        />
      </div>

      {/* credit progress bar */}
      <div className="credit-label-row">
        <span>Credit progress</span>
        <span>{profile.credits} / 120 ({creditPercent}%)</span>
      </div>
      <div className="credit-bar-bg">
        <div className="credit-bar-fill" style={{ width: `${creditPercent}%` }} />
      </div>
      <button className="save-btn" onClick={handleSave}>
        Save
      </button>

    </div>
  )
}