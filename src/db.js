import { openDB } from 'idb'

// ── open (or create) the database ──
// name: 'smart-campus-db'
// version: 1
// if the database does not exist yet, onupgrade creates it
const dbPromise = openDB('smart-campus-db', 1, {
  upgrade(db) {
    // create the notes object store if it does not exist
    if (!db.objectStoreNames.contains('notes')) {
      db.createObjectStore('notes', { keyPath: 'id' })
    }
  },
})

// ── save a note to IndexedDB ──
export async function saveNote(note) {
  const db = await dbPromise
  await db.put('notes', note)
}

// ── get all notes from IndexedDB ──
export async function getAllNotes() {
  const db = await dbPromise
  return db.getAll('notes')
}

// ── delete a note by id ──
export async function deleteNote(id) {
  const db = await dbPromise
  await db.delete('notes', id)
}