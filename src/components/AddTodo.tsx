"use client"

import { useState, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { useTodos } from "../context/TodoContext"
import type { TodoInput } from "../types"

function AddTodo() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const { addTodo } = useTodos()
  const navigate = useNavigate()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      alert("Please enter a task title")
      return
    }

    const newTodo: TodoInput = {
      title,
      description,
      completed: false,
      createdAt: new Date().toISOString(),
    }

    addTodo(newTodo)
    navigate("/")
  }

  return (
    <div>
      <h2 style={{ marginBottom: "1.5rem", color: "var(--accent-pink)" }}>Add New Task</h2>

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

        <div style={{ display: "flex", gap: "1rem" }}>
          <button type="submit" className="btn btn-primary">
            Add Task
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate("/")}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddTodo
