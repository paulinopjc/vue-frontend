export type TaskStatus = 'todo' | 'in_progress' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high'

export interface Tag {
  id: number
  name: string
}

export interface TaskUser {
  id: number
  name: string
}

export interface Task {
  id: number
  title: string
  description: string | null
  status: TaskStatus
  priority: TaskPriority
  creator: TaskUser
  assigned_to: TaskUser | null
  due_date: string | null
  tags: Tag[]
  created_at: string
  updated_at: string
}

export interface TaskFilters {
  status?: TaskStatus | ''
  priority?: TaskPriority | ''
  search?: string
}

export interface PaginatedTasks {
  data: Task[]
  next_cursor: string | null
}
