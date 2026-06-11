import { useState, useRef } from 'react'
import './notes.css'

export default function Notes() {

  // ── camera states ──
  const [cameraOpen, setCameraOpen]         = useState(false)
  const [permissionDenied, setPermissionDenied] = useState(false)
  const [captureSuccess, setCaptureSuccess] = useState(false)

  // ── saved notes state ──
  // for now just an empty array
  // Day 7 will load real photos from IndexedDB
  const [notes, setNotes] = useState([])

  // ── refs for video and canvas elements ──
  // useRef because we need direct access to the DOM elements
  const videoRef  = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)

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
  function takePhoto() {
    const video  = videoRef.current
    const canvas = canvasRef.current
    const ctx    = canvas.getContext('2d')

    // set canvas size to match video
    canvas.width  = video.videoWidth
    canvas.height = video.videoHeight

    // draw current video frame onto canvas
    ctx.drawImage(video, 0, 0)

    // convert to base64 image
    const imageData = canvas.toDataURL('image/jpeg', 0.8)

    // for now just add to local state
    // Day 7 will save this to IndexedDB instead
    const newNote = {
      id:        Date.now(),
      image:     imageData,
      timestamp: new Date().toLocaleString('en-US', {
        month: 'short',
        day:   'numeric',
        hour:  '2-digit',
        minute:'2-digit',
      })
    }

    setNotes(prev => [newNote, ...prev])
    closeCamera()
    setCaptureSuccess(true)

    // hide success message after 3 seconds
    setTimeout(() => setCaptureSuccess(false), 3000)
  }

  // ── delete a note ──
  function deleteNote(id) {
    setNotes(prev => prev.filter(n => n.id !== id))
  }

  return (
    <div className="notes-page">

      <h1>Lecture notes</h1>
      <p className="subtitle">Capture handwritten notes with camera</p>

      {/* permission denied error */}
      {permissionDenied && (
        <div className="permission-error">
          <p>📵 Camera access denied</p>
          <small>
            Please allow camera access in your browser settings
            then try again.
          </small>
        </div>
      )}

      {/* success message after capture */}
      {captureSuccess && (
        <div className="capture-success">
          ✓ Note captured and saved!
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

      {/* capture zone — shown when camera is closed */}
      {!cameraOpen && (
        <div className="capture-zone" onClick={openCamera}>
          <span className="camera-icon">📷</span>
          <p>Tap to capture a note</p>
          <small>Uses getUserMedia() Camera API</small>
        </div>
      )}

      {/* capture button below zone */}
      {!cameraOpen && (
        <button className="capture-btn" onClick={openCamera}>
          Open camera
        </button>
      )}

      {/* saved notes grid */}
      <div className="section-title">
        Saved notes ({notes.length})
      </div>

      <div className="notes-grid">
        {notes.length === 0 && (
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
              onClick={() => deleteNote(note.id)}
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