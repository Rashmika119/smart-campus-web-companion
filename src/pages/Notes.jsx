import { useState, useRef, useEffect } from 'react'
import { saveNote, getAllNotes, deleteNote } from '../db'
import './Notes.css'

export default function Notes() {

  // ── camera states ──
  const [cameraOpen, setCameraOpen] = useState(false)
  const [permissionDenied, setPermissionDenied] = useState(false)
  const [captureSuccess, setCaptureSuccess] = useState(false)

  // ── notes loaded from IndexedDB ──
  const [notes, setNotes] = useState([])

  // ── loading state while IndexedDB loads ──
  const [loading, setLoading] = useState(true)

  // ── refs for video and canvas ──
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)

  // ── load all notes from IndexedDB on first render ──
  useEffect(() => {
    async function loadNotes() {
      try {
        const saved = await getAllNotes()
        // sort by newest first
        saved.sort((a, b) => b.id - a.id)
        setNotes(saved)
      } catch (err) {
        console.error('Failed to load notes:', err)
      } finally {
        setLoading(false)
      }
    }
    loadNotes()
  }, [])

  // ── open camera — Day 7 will fill this in ──
  async function openCamera() {
    setPermissionDenied(false)
    setCaptureSuccess(false)

    try {
      let stream
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        })
      } catch {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true
        })
      }

      streamRef.current = stream

      // set camera open FIRST so the video element renders
      setCameraOpen(true)

      // then wait for next render before setting srcObject
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      }, 100)

    } catch (err) {
      console.log('Camera error:', err.name, err.message)
      setPermissionDenied(true)
      setCameraOpen(false)
    }
  }
  // ── close camera and stop stream ──
  function closeCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setCameraOpen(false)
  }

  // ── take photo — Day 7 will add IndexedDB save here ──
  async function takePhoto() {
    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    // set canvas size to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // draw current video frame onto canvas
    ctx.drawImage(video, 0, 0)

    // convert to base64 image
    const imageData = canvas.toDataURL('image/jpeg', 0.8)

    // for now just add to local state
    // Day 7 will save this to IndexedDB instead
    const newNote = {
      id: Date.now(),
      image: imageData,
      timestamp: new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    }

    try {
      // ✅ save to IndexedDB — persists after refresh
      await saveNote(newNote)

      // update local state so UI updates immediately
      setNotes(prev => [newNote, ...prev])

      closeCamera()
      setCaptureSuccess(true)
      setTimeout(() => setCaptureSuccess(false), 3000)

    } catch (err) {
      console.error('Failed to save note:', err)
      alert('Failed to save photo. Please try again.')
    }
  }

  // ── delete a note ──
    async function handleDelete(id) {
      try {
        await deleteNote(id)
        setNotes(prev => prev.filter(n => n.id !== id))
      } catch (err) {
        console.error('Failed to delete note:', err)
      }
    }

    return (
      <div className="notes-page">

        <h1>Lecture notes</h1>
        <p className="subtitle">Capture handwritten notes with camera</p>

        {/* permission denied error */}
        {permissionDenied && (
          <div className="permission-error">
            <p>📵 Camera not available</p>
            <small>
              Please allow camera access in your browser
              settings and make sure no other app is using
              the camera.
            </small>
          </div>
        )}

        {/* success message */}
        {captureSuccess && (
          <div className="capture-success">
            ✓ Note captured and saved to IndexedDB!
          </div>
        )}

      {/* camera preview — shown when camera is open */}
        {cameraOpen && (
          <div className="camera-preview-wrap">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="camera-video"
            />
            <canvas ref={canvasRef} className="hidden-canvas" />
            <div className="camera-actions">
              <button className="btn-take-photo" onClick={takePhoto}>
                📸 Take photo
              </button>
              <button className="btn-cancel-camera" onClick={closeCamera}>
                ✕ Cancel
              </button>
            </div>
          </div>
        )}

        {/* capture zone */}
        {!cameraOpen && (
          <div className="capture-zone" onClick={openCamera}>
            <span className="camera-icon">📷</span>
            <p>Tap to capture a note</p>
            <small>Saved permanently using IndexedDB</small>
          </div>
        )}

        {!cameraOpen && (
          <button className="capture-btn" onClick={openCamera}>
            Open camera
          </button>
        )}

        {/* saved notes */}
        <div className="section-title">
          Saved notes ({notes.length})
        </div>

        {/* loading state */}
        {loading && (
          <p style={{ fontSize: 13, color: '#9ca3af', textAlign: 'center', padding: 16 }}>
            Loading notes...
          </p>
        )}

        <div className="notes-grid">
          {!loading && notes.length === 0 && (
            <div className="empty-notes">
              <p>No notes yet</p>
              <small>Capture your first lecture note above</small>
            </div>
          )}

          {notes.map(note => (
            <div key={note.id} className="note-thumb">
              <img src={note.image} alt="Lecture note" />
              <div className="note-thumb-label">{note.timestamp}</div>
              <button
                className="note-delete-btn"
                onClick={() => handleDelete(note.id)}
                aria-label="Delete note"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

      </div>
    )
  }
