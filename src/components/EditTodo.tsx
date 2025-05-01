"use client"

import { useState, useEffect, type FormEvent } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useTodos } from "../context/TodoContext"
import type { TodoUpdate } from "../types"

function EditTodo() {
  const { id } = useParams<{ id: string }>()
  const { todos, updateTodo } = useTodos()
  const navigate = useNavigate()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    if (!id) return

    const todo = todos.find((todo) => todo.id === Number.parseInt(id))
    if (todo) {
      setTitle(todo.title)
      setDescription(todo.description || "")
      setCompleted(todo.completed)
    } else {
      navigate("/")
    }
  }, [id, todos, navigate])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !id) {
      alert("Please enter a task title")
      return
    }

    const updates: TodoUpdate = {
      title,
      description,
      completed,
    }

    updateTodo(Number.parseInt(id), updates)
    navigate("/")
  }

  return (
    <div>
      <h2 style={{ marginBottom: "1.5rem", color: "var(--accent-cyan)" }}>Edit Task</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title" className="form-label">
            Task Title
          </label>
          <input
            type="text"
            id="title"
            className="form-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task title"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Description (Optional)
          </label>
          <textarea
            id="description"
            className="form-input form-textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter task description"
          />
        </div>

        <div className="form-group" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <input
            type="checkbox"
            id="completed"
            className="checkbox"
            checked={completed}
            onChange={(e) => setCompleted(e.target.checked)}
          />
          <label htmlFor="completed" style={{ color: "var(--text-primary)", cursor: "pointer" }}>
            Mark as completed
          </label>
        </div>

        <div style={{ display: "flex", gap: "1rem" }}>
          <button type="submit" className="btn btn-primary">
            Update Task
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate("/")}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditTodo
