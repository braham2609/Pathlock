import { useEffect, useMemo, useState } from 'react'
import { Api } from './api'
import type { Task, Filter } from './types'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'
import FilterBar from './components/FilterBar'
import './styles.css'

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<Filter>(() => (localStorage.getItem('filter') as Filter) || 'all')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    Api.list()
      .then(setTasks)
      .catch(e => setError(extract(e)))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { localStorage.setItem('filter', filter) }, [filter])

  const visible = useMemo(() => {
    switch (filter) {
      case 'active': return tasks.filter(t => !t.isCompleted)
      case 'completed': return tasks.filter(t => t.isCompleted)
      default: return tasks
    }
  }, [tasks, filter])

  const add = async (desc: string) => {
    setError(null)
    const created = await Api.create(desc)
    setTasks(prev => [...prev, created])
  }

  const toggle = async (t: Task) => {
    setError(null)
    const updated = await Api.update(t.id, { isCompleted: !t.isCompleted })
    setTasks(prev => prev.map(x => x.id === t.id ? updated : x))
  }

  const remove = async (t: Task) => {
    setError(null)
    await Api.remove(t.id)
    setTasks(prev => prev.filter(x => x.id !== t.id))
  }

  return (
    <div className="container">
      <h1>Task Manager</h1>
      <div className="toolbar">
        <FilterBar value={filter} onChange={setFilter} />
      </div>

      {error && <div className="alert">{error}</div>}
      {loading ? <p>Loading…</p> : (
        <>
          <TaskForm onAdd={add} />
          <TaskList tasks={visible} onToggle={toggle} onDelete={remove} />
        </>
      )}
    </div>
  )
}

function extract(e: unknown) {
  if (e instanceof Error) return e.message
  try { return JSON.stringify(e) } catch { return String(e) }
}
