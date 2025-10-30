import { useState } from 'react'

export default function TaskForm({ onAdd }: { onAdd: (desc: string) => Promise<void> }) {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const desc = text.trim()
    if (!desc) return
    setLoading(true)
    try {
      await onAdd(desc)
      setText('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} style={{ display: 'flex', gap: 8 }}>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Add a task…"
        aria-label="Task description"
        className="input"
      />
      <button disabled={loading} type="submit">{loading ? 'Adding…' : 'Add'}</button>
    </form>
  )
}
