import type { Filter } from '../types'

export default function FilterBar({ value, onChange }: {
  value: Filter
  onChange: (f: Filter) => void
}) {
  const btn = (k: Filter, label: string) => (
    <button
      onClick={() => onChange(k)}
      className={`px-3 py-1 rounded border ${value === k ? 'bg-black text-white' : 'bg-white'}`}
      aria-pressed={value === k}
    >{label}</button>
  )

  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {btn('all', 'All')}
      {btn('active', 'Active')}
      {btn('completed', 'Completed')}
    </div>
  )
}
