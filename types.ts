export type Task = {
  id: number
  description: string
  isCompleted: boolean
}

export type Filter = 'all' | 'active' | 'completed'
