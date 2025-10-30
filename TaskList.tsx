import type { Task } from '../types'

export default function TaskList({ tasks, onToggle, onDelete }: {
  tasks: Task[]
  onToggle: (t: Task) => Promise<void>
  onDelete: (t: Task) => Promise<void>
}) {
  if (!tasks.length) return <p style={{ opacity: .7 }}>No tasks</p>

  return (
    <ul className="list">
      {tasks.map(t => (
        <li key={t.id} className="row">
          <label className="cell left">
            <input
              type="checkbox"
              checked={t.isCompleted}
              onChange={() => onToggle(t)}
              aria-label={t.isCompleted ? 'Mark as active' : 'Mark as completed'}
            />
            <span className={t.isCompleted ? 'done' : ''}>{t.description}</span>
          </label>
          <button className="danger" onClick={() => onDelete(t)} aria-label={`Delete ${t.description}`}>Delete</button>
        </li>
      ))}
    </ul>
  )
}
