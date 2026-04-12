export interface User {
  id: number
  name: string
  email: string
  role: string
  team_id: number | null
  is_active: boolean
}

export interface AuthResponse {
  token: string
  user: User
}
