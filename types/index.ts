export interface Todo {
    id: number
    title: string
    description?: string
    completed: boolean
    createdAt: string
  }
  
  export type TodoInput = Omit<Todo, "id">
  export type TodoUpdate = Partial<Omit<Todo, "id" | "createdAt">>
  