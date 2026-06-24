import { useState, useEffect } from 'react'
import './Assignments.css'

// helpers
function today() {
  return new Date().toISOString().split('T')[0]   // "YYYY-MM-DD"
}

function isOverdue(dueDate, done) {
  return !done && dueDate && dueDate < today()
}

export default function Assignments() {

  // load saved assignments from localStorage on first render
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('sc_assignments')
    return saved ? JSON.parse(saved) : []
  })

  // form fields
  const [
    title, setTitle] = useState('')
  const [subject, setSubject] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [titleErr, setTitleErr] = useState('')

  // active filter — 'all' | 'pending' | 'done'
  const [filter, setFilter] = useState('all')

  const [schedule, setSchedule] = useState([])
  const [loading, setLoading] = useState(true)

  // save to localStorage whenever tasks change
  function save(updated) {
    setTasks(updated)
    localStorage.setItem('sc_assignments', JSON.stringify(updated))
  }

  // add new task
  function handleAdd() {
    if (!title.trim()) {
      setTitleErr('Title is required')
      return
    }
    setTitleErr('')
    const newTask = {
      id: Date.now(),
      title: title.trim(),
      subject: subject || 'General',
      dueDate: dueDate || '',
      done: false,
    }
    save([newTask, ...tasks])
    setTitle('')
    setSubject('')
    setDueDate('')
  }

  // toggle done/pending
  function toggleDone(id) {
    save(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }

  // delete task
  function deleteTask(id) {
    save(tasks.filter(t => t.id !== id))
  }

  // filter tasks
  const filtered = tasks.filter(t => {
    if (filter === 'pending') return !t.done
    if (filter === 'done') return t.done
    return true
  })

  const doneCount = tasks.filter(t => t.done).length
  const pendingCount = tasks.filter(t => !t.done).length
  const percent = tasks.length ? Math.round((doneCount / tasks.length) * 100) : 0

  useEffect(() => {
    async function fetchSchedule() {
      try {
        const response = await fetch(
          'https://6a380b13c105017aa6399990.mockapi.io/schedule'
        )
        if (!response.ok) throw new Error('Failed to fetch schedule')
        const data = await response.json()
        setSchedule(data)
      } catch (err) {
        console.error('Schedule fetch error:', err)
      } finally {
        setScheduleLoading(false)
      }
    }
    fetchSchedule()
  }, [])

  const subjects = [...new Set(schedule.map(item => item.subject))]

  return (
    <div className="assignments-page page-container">

      <h1>Assignments</h1>
      <p>Track your tasks and deadlines</p>

      {/* progress bar */}
      <div className="progress-row">
        <span>Overall progress</span>
        <span>{doneCount} / {tasks.length} done ({percent}%)</span>
      </div>
      <div className="progress-bg">
        <div className="progress-fill" style={{ width: `${percent}%` }} />
      </div>

      {/* add form */}
      <div className="add-form">
        <input
          value={title}
          onChange={e => { setTitle(e.target.value); setTitleErr('') }}
          placeholder="Assignment title *"
          className={titleErr ? 'error' : ''}
        />
        {titleErr && <p className="error-msg">{titleErr}</p>}

        <select value={subject} onChange={e => setSubject(e.target.value)}>
          <option value="">Select subject</option>

          {subjects.map(sub => (
            <option key={sub} value={sub}>
              {sub}
            </option>
          ))}

          <option value="General">General</option>
        </select>

        <input
          type="date"
          value={dueDate}
          onChange={e => setDueDate(e.target.value)}
        />

        <button className="add-btn" onClick={handleAdd}>
          + Add Assignment
        </button>
      </div>

      {/* filter buttons */}
      <div className="filter-row">
        <button
          className={`filter-btn ${filter === 'all' ? 'active-all' : ''}`}
          onClick={() => setFilter('all')}
        >All ({tasks.length})</button>

        <button
          className={`filter-btn ${filter === 'pending' ? 'active-pending' : ''}`}
          onClick={() => setFilter('pending')}
        >Pending ({pendingCount})</button>

        <button
          className={`filter-btn ${filter === 'done' ? 'active-done' : ''}`}
          onClick={() => setFilter('done')}
        >Done ({doneCount})</button>
      </div>

      {/* task list */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <p>
            {filter === 'done' && 'No completed assignments yet.'}
            {filter === 'pending' && '🎉 All done! Nothing pending.'}
            {filter === 'all' && 'No assignments yet. Add one above!'}
          </p>
        </div>
      ) : (
        filtered.map(task => (
          <div
            key={task.id}
            className={`task-card ${task.done ? 'done-card' : ''}`}
          >
            <input
              type="checkbox"
              checked={task.done}
              onChange={() => toggleDone(task.id)}
            />
            <div style={{ flex: 1 }}>
              <div className="task-title">{task.title}</div>
              <div className="task-meta">
                {task.subject}
                {task.dueDate && (
                  <span className={`task-due ${isOverdue(task.dueDate, task.done) ? 'overdue' : ''}`}>
                    {' · '}{isOverdue(task.dueDate, task.done) ? '⚠ Overdue — ' : 'Due '}
                    {task.dueDate}
                  </span>
                )}
              </div>
            </div>
            <button className="delete-btn" onClick={() => deleteTask(task.id)}>✕</button>
          </div>
        ))
      )}

    </div>
  )
}