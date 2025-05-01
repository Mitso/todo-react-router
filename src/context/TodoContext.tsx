"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import { openDB } from "../services/db"
import type { Todo, TodoInput, TodoUpdate } from "../types"

interface TodoContextType {
  todos: Todo[]
  loading: boolean
  error: string | null
  fetchTodos: () => Promise<void>
  addTodo: (todo: TodoInput) => Promise<void>
  updateTodo: (id: number, updates: TodoUpdate) => Promise<void>
  toggleTodo: (id: number) => Promise<void>
  deleteTodo: (id: number) => Promise<void>
}

const TodoContext = createContext<TodoContextType | null>(null)

interface TodoProviderProps {
  children: ReactNode
}

export function TodoProvider({ children }: TodoProviderProps) {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTodos = useCallback(async () => {
    try {
      setLoading(true)
      const db = await openDB()

      return new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(["todos"], "readonly")
        const objectStore = transaction.objectStore("todos")
        const request = objectStore.getAll()

        request.onsuccess = (event) => {
          const result = (event.target as IDBRequest).result
          const todosArray = Array.isArray(result) ? result : []

          // Sort by creation date, newest first
          todosArray.sort((a: Todo, b: Todo) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

          setTodos(todosArray)
          setError(null)
          setLoading(false)
          resolve()
        }

        request.onerror = (event) => {
          console.error("Error fetching todos:", (event.target as IDBRequest).error)
          setError("Failed to load tasks. Please refresh the page.")
          setLoading(false)
          reject((event.target as IDBRequest).error)
        }
      })
    } catch (err) {
      console.error("Error in fetchTodos:", err)
      setError("Failed to load tasks. Please refresh the page.")
      setLoading(false)
    }
  }, [])

  const addTodo = async (todo: TodoInput) => {
    try {
      const db = await openDB()

      return new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(["todos"], "readwrite")
        const objectStore = transaction.objectStore("todos")

        // First get all todos to find the max ID
        const getAllRequest = objectStore.getAll()

        getAllRequest.onsuccess = (event) => {
          const allTodos = (event.target as IDBRequest).result || []
          const maxId = allTodos.length > 0 ? Math.max(...allTodos.map((t: Todo) => t.id)) : 0

          const newTodo: Todo = {
            ...todo,
            id: maxId + 1,
          }

          // Now add the new todo
          const addRequest = objectStore.add(newTodo)

          addRequest.onsuccess = () => {
            setTodos((prevTodos) => [newTodo, ...prevTodos])
            resolve()
          }

          addRequest.onerror = (event) => {
            console.error("Error adding todo:", (event.target as IDBRequest).error)
            setError("Failed to add task. Please try again.")
            reject((event.target as IDBRequest).error)
          }
        }

        getAllRequest.onerror = (event) => {
          console.error("Error getting todos for ID:", (event.target as IDBRequest).error)
          setError("Failed to add task. Please try again.")
          reject((event.target as IDBRequest).error)
        }
      })
    } catch (err) {
      console.error("Error in addTodo:", err)
      setError("Failed to add task. Please try again.")
    }
  }

  const updateTodo = async (id: number, updates: TodoUpdate) => {
    try {
      const db = await openDB()

      return new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(["todos"], "readwrite")
        const objectStore = transaction.objectStore("todos")
        const getRequest = objectStore.get(id)

        getRequest.onsuccess = (event) => {
          const todo = (event.target as IDBRequest).result
          if (!todo) {
            const error = new Error("Todo not found")
            console.error(error)
            setError("Failed to update task. Task not found.")
            reject(error)
            return
          }

          // Ensure we preserve the id and any other required fields
          const updatedTodo: Todo = {
            ...todo,
            ...updates,
            id: todo.id, // Explicitly ensure ID is preserved
          }

          const putRequest = objectStore.put(updatedTodo)

          putRequest.onsuccess = () => {
            setTodos((prevTodos) => prevTodos.map((t) => (t.id === id ? updatedTodo : t)))
            resolve()
          }

          putRequest.onerror = (event) => {
            console.error("Error updating todo:", (event.target as IDBRequest).error)
            setError("Failed to update task. Please try again.")
            reject((event.target as IDBRequest).error)
          }
        }

        getRequest.onerror = (event) => {
          console.error("Error getting todo for update:", (event.target as IDBRequest).error)
          setError("Failed to update task. Please try again.")
          reject((event.target as IDBRequest).error)
        }
      })
    } catch (err) {
      console.error("Error in updateTodo:", err)
      setError("Failed to update task. Please try again.")
    }
  }

  const toggleTodo = async (id: number) => {
    try {
      const db = await openDB()

      return new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(["todos"], "readwrite")
        const objectStore = transaction.objectStore("todos")
        const getRequest = objectStore.get(id)

        getRequest.onsuccess = (event) => {
          const todo = (event.target as IDBRequest).result
          if (!todo) {
            const error = new Error("Todo not found")
            console.error(error)
            setError("Failed to update task status. Task not found.")
            reject(error)
            return
          }

          // Create updated todo with completed status toggled, ensuring ID is preserved
          const updatedTodo: Todo = {
            ...todo,
            completed: !todo.completed,
            id: todo.id, // Explicitly ensure ID is preserved
          }

          console.log("Updating todo:", updatedTodo)

          const putRequest = objectStore.put(updatedTodo)

          putRequest.onsuccess = () => {
            setTodos((prevTodos) => prevTodos.map((t) => (t.id === id ? updatedTodo : t)))
            resolve()
          }

          putRequest.onerror = (event) => {
            console.error("Error toggling todo:", (event.target as IDBRequest).error)
            setError("Failed to update task status. Please try again.")
            reject((event.target as IDBRequest).error)
          }
        }

        getRequest.onerror = (event) => {
          console.error("Error getting todo for toggle:", (event.target as IDBRequest).error)
          setError("Failed to update task status. Please try again.")
          reject((event.target as IDBRequest).error)
        }
      })
    } catch (err) {
      console.error("Error in toggleTodo:", err)
      setError("Failed to update task status. Please try again.")
    }
  }

  const deleteTodo = async (id: number) => {
    try {
      const db = await openDB()

      return new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(["todos"], "readwrite")
        const objectStore = transaction.objectStore("todos")
        const deleteRequest = objectStore.delete(id)

        deleteRequest.onsuccess = () => {
          setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id))
          resolve()
        }

        deleteRequest.onerror = (event) => {
          console.error("Error deleting todo:", (event.target as IDBRequest).error)
          setError("Failed to delete task. Please try again.")
          reject((event.target as IDBRequest).error)
        }
      })
    } catch (err) {
      console.error("Error in deleteTodo:", err)
      setError("Failed to delete task. Please try again.")
    }
  }

  return (
    <TodoContext.Provider
      value={{
        todos,
        loading,
        error,
        fetchTodos,
        addTodo,
        updateTodo,
        toggleTodo,
        deleteTodo,
      }}
    >
      {children}
    </TodoContext.Provider>
  )
}

export function useTodos(): TodoContextType {
  const context = useContext(TodoContext)
  if (!context) {
    throw new Error("useTodos must be used within a TodoProvider")
  }
  return context
}
