import { useState } from 'react'
import './Profile.css'

const DEFAULT_PROFILE = {
  name:      '',
  regNumber: '',
  year:      '',
  credits:   0,
}

export default function Profile() {

  // load saved profile from localStorage on first render
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('sc_profile')
    return saved ? JSON.parse(saved) : DEFAULT_PROFILE
  })

  // track if there are unsaved changes
  const [hasChanges, setHasChanges] = useState(false)

  // track save success message
  const [saved, setSaved] = useState(false)

  // single handler for all inputs
  function handleChange(e) {
    const { name, value } = e.target
    setProfile(prev => ({ ...prev, [name]: value }))
    setHasChanges(true)
    setSaved(false)
  }

  // save button handler
  function handleSave() {
    localStorage.setItem('sc_profile', JSON.stringify(profile))
    setHasChanges(false)
    setSaved(true)

    // hide saved message after 2 seconds
    setTimeout(() => setSaved(false), 2000)
  }

  // get initials for avatar
  function getInitials(name) {
    const parts = name.trim().split(' ').filter(Boolean)
    if (parts.length === 0) return '?'
    if (parts.length === 1) return parts[0][0].toUpperCase()
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }

  // credit calculations
  const credits     = Math.min(120, Math.max(0, parseInt(profile.credits) || 0))
  const creditPct   = Math.round((credits / 120) * 100)
  const creditsLeft = 120 - credits

  // assignment stats from localStorage
  const assignments  = JSON.parse(localStorage.getItem('sc_assignments') || '[]')
  const doneCount    = assignments.filter(a => a.done).length
  const pendingCount = assignments.filter(a => !a.done).length

return (
    <div className="profile-page">

      <h1>Profile</h1>
      <p className="subtitle">Your academic details</p>

      {/* avatar */}
      <div className="avatar">
        {profile.name ? getInitials(profile.name) : '?'}
      </div>

      {/* stats — moved to TOP */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="val">{doneCount}</div>
          <div className="lbl">Tasks done</div>
        </div>
        <div className="stat-card">
          <div className="val">{creditsLeft}</div>
          <div className="lbl">Credits left</div>
        </div>
      </div>

      <div className="divider" />

      {/* name */}
      <div className="form-group">
        <label>Full name</label>
        <input
          name="name"
          value={profile.name}
          onChange={handleChange}
          placeholder="e.g. Ashan Perera"
        />
      </div>

      {/* registration number */}
      <div className="form-group">
        <label>Registration number</label>
        <input
          name="regNumber"
          value={profile.regNumber}
          onChange={handleChange}
          placeholder="e.g. SE/2021/017"
        />
      </div>

      {/* year of study */}
      <div className="form-group">
        <label>Year of study</label>
        <select
          name="year"
          value={profile.year}
          onChange={handleChange}
        >
          <option value="">Select year...</option>
          <option value="1st Year">1st Year</option>
          <option value="2nd Year">2nd Year</option>
          <option value="3rd Year">3rd Year</option>
          <option value="4th Year">4th Year</option>
        </select>
      </div>

      {/* completed credits */}
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
      <div className="credit-section">
        <div className="credit-label-row">
          <span>Credit progress</span>
          <span>{credits} / 120 ({creditPct}%)</span>
        </div>
        <div className="credit-bar-bg">
          <div
            className="credit-bar-fill"
            style={{ width: `${creditPct}%` }}
          />
        </div>
      </div>

      <div className="divider" />

      {/* unsaved changes warning */}
      {hasChanges && !saved && (
        <p className="unsaved-msg">You have unsaved changes</p>
      )}

      {/* save button — moved to BOTTOM */}
      <button
        className={`save-btn ${hasChanges ? 'save-btn-active' : ''}`}
        onClick={handleSave}
      >
        {saved ? '✓ Saved!' : 'Save profile'}
      </button>

    </div>
  )
}