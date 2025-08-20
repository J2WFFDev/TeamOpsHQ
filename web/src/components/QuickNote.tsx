'use client'

import React from 'react'
import { db } from '@/lib/dexie'

export default function QuickNote() {
  const [text, setText] = React.useState('')
  const [athleteId, setAthleteId] = React.useState('')
  const [itemType, setItemType] = React.useState<'NOTE'|'TASK'|'JOURNAL'|'DECISION'>('NOTE')
  const [dueDate, setDueDate] = React.useState<string>('')
  const [assignedTo, setAssignedTo] = React.useState<string>('')
  const [tags, setTags] = React.useState<string>('')
  const [filePreviewUrl, setFilePreviewUrl] = React.useState<string | null>(null)
  const fileBlobRef = React.useRef<Blob | null>(null)
  const fileNameRef = React.useRef<string | null>(null)
  const [cameraActive, setCameraActive] = React.useState(false)
  const videoRef = React.useRef<HTMLVideoElement | null>(null)
  const streamRef = React.useRef<MediaStream | null>(null)
  const [pending, setPending] = React.useState(0)

  React.useEffect(() => {
    let mounted = true
    const update = async () => {
      try {
        const count = await db.pendingActions.count()
        if (mounted) setPending(count)
      } catch {
        // ignore
      }
    }
    update()
    const id = setInterval(update, 1000)
    return () => {
      mounted = false
      clearInterval(id)
    }
  }, [])

  async function saveOffline(e?: React.FormEvent) {
    if (e) e.preventDefault()
      if (!text.trim()) return
      const createdAt = Date.now()
    // Add note record (mediaPath will be set after upload)
    await db.notes.add({ athleteId: athleteId || 'unspecified', text: text.trim(), createdAt, synced: false, mediaPath: null, type: itemType, status: 'NEW', tags: tags ? tags.split(',').map(t=>t.trim()): [] , dueDate: dueDate ? Date.parse(dueDate) : null, assignedTo: assignedTo || null })

  // If there's a selected file stored as a blob in IndexedDB, attach its id to the pending action
  let attachmentId: number | null = null
  if (fileBlobRef.current) {
    const blob = fileBlobRef.current
    const att = { noteCreatedAt: createdAt, name: fileNameRef.current || 'photo.jpg', type: blob.type || 'image/jpeg', blob, createdAt, uploaded: false, mediaPath: null }
    attachmentId = await db.mediaAttachments.add(att)
  }

  await db.pendingActions.add({ type: 'create_item', payload: { athleteId: athleteId || null, text, noteCreatedAt: createdAt, attachmentId, itemType, dueDate: dueDate ? Date.parse(dueDate): null, assignedTo: assignedTo || null, tags: tags ? tags.split(',').map(t=>t.trim()): [] }, createdAt })
    try {
      const { registerBgSync } = await import('@/lib/sync')
      registerBgSync()
    } catch {
      // ignore
    }
    setText('')
    // clear blob refs and preview
    fileBlobRef.current = null
    fileNameRef.current = null
    if (filePreviewUrl) {
      URL.revokeObjectURL(filePreviewUrl)
      setFilePreviewUrl(null)
    }
  const count = await db.pendingActions.count()
    setPending(count)
  }

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
  // store the File/Blob in a ref to persist until save
  fileBlobRef.current = file
  fileNameRef.current = file.name
  // create a local object URL for preview
  const url = URL.createObjectURL(file)
  setFilePreviewUrl(url)
  }

  async function startCamera() {
    if (!('mediaDevices' in navigator)) return
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false })
      streamRef.current = s
      setCameraActive(true)
      if (videoRef.current) videoRef.current.srcObject = s
    } catch (err) {
      console.error('camera failed', err)
    }
  }

  function stopCamera() {
    try {
      streamRef.current?.getTracks().forEach(t => t.stop())
    } catch {
      // ignore
    }
    streamRef.current = null
    setCameraActive(false)
  }

  async function capturePhoto() {
    if (!videoRef.current) return
    const video = videoRef.current
    const w = video.videoWidth || 1280
    const h = video.videoHeight || 720
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.drawImage(video, 0, 0, w, h)
    const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(b => resolve(b), 'image/jpeg', 0.85))
    if (!blob) return
    fileBlobRef.current = blob
    fileNameRef.current = `camera_${Date.now()}.jpg`
    const url = URL.createObjectURL(blob)
    setFilePreviewUrl(url)
    // stop camera after capture
    stopCamera()
  }

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h3 className="font-semibold mb-2">Quick Offline Note (demo)</h3>
      <form onSubmit={saveOffline} className="space-y-2">
        <div className="flex gap-2">
          <select value={itemType} onChange={e => setItemType(e.target.value as any)} className="border rounded p-2">
            <option value="NOTE">Note</option>
            <option value="TASK">Task</option>
            <option value="JOURNAL">Journal</option>
            <option value="DECISION">Decision</option>
          </select>
          <input aria-label="athlete-id" value={athleteId} onChange={e => setAthleteId(e.target.value)} placeholder="Athlete ID (optional)" className="flex-1 border rounded p-2" />
        </div>
        <div>
          <input aria-label="athlete-id" value={athleteId} onChange={e => setAthleteId(e.target.value)} placeholder="Athlete ID (optional)" className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="text-sm">Attach photo (optional)</label>
          <div className="flex gap-2 items-center mt-1">
            <input aria-label="note-photo" type="file" accept="image/*" onChange={onFileChange} className="" />
            {!cameraActive && <button type="button" onClick={startCamera} className="ml-2 text-sm px-2 py-1 border rounded">Use camera</button>}
            {cameraActive && <button type="button" onClick={capturePhoto} className="ml-2 text-sm px-2 py-1 bg-teal-500 text-white rounded">Capture</button>}
            {cameraActive && <button type="button" onClick={stopCamera} className="ml-2 text-sm px-2 py-1 border rounded">Stop</button>}
          </div>
          {cameraActive && <div className="mt-2"><video ref={videoRef} autoPlay playsInline className="w-full rounded" /></div>}
          {filePreviewUrl && <img src={filePreviewUrl} alt="preview" className="mt-2 max-h-40 object-contain" />}
        </div>
        <div>
          <textarea aria-label="note-text" value={text} onChange={e => setText(e.target.value)} placeholder="Quick note..." className="w-full border rounded p-2 h-24" />
        </div>
        {itemType === 'TASK' && (
          <div className="flex gap-2">
            <input type="date" value={dueDate} onChange={e=>setDueDate(e.target.value)} className="border rounded p-2" />
            <input aria-label="assigned-to" placeholder="Assign to (optional)" value={assignedTo} onChange={e=>setAssignedTo(e.target.value)} className="flex-1 border rounded p-2" />
          </div>
        )}
        <div>
          <input aria-label="tags" placeholder="tags (comma separated)" value={tags} onChange={e=>setTags(e.target.value)} className="w-full border rounded p-2" />
        </div>
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">Pending sync: <strong>{pending}</strong></div>
          <div>
            <button type="submit" className="bg-teal-500 text-white px-4 py-2 rounded">Save Offline</button>
          </div>
        </div>
      </form>
    </div>
  )
}
