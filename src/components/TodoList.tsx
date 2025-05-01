"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useTodos } from "../context/TodoContext"
import TodoItem from "./TodoItem"

type FilterType = "all" | "active" | "completed"

function TodoList() {
  const { todos, loading, error, fetchTodos } = useTodos()
  const [filter, setFilter] = useState<FilterType>("all")

  useEffect(() => {
    fetchTodos()
  }, [fetchTodos])

  useEffect(() => {
    console.log("Current todos:", todos)
  }, [todos])

  if (loading) {
    return (
      <div className="empty-state">
        <h3>Loading tasks...</h3>
      </div>
    )
  }

  if (error) {
    return (
      <div className="empty-state">
        <h3>Error: {error}</h3>
      </div>
    )
  }

  const filteredTodos = todos.filter((todo) => {
    if (filter === "all") return true
    if (filter === "active") return !todo.completed
    if (filter === "completed") return todo.completed
    return true
  })

  return (
    <div>
      <div className="filter-controls" style={{ marginBottom: "1.5rem", display: "flex", gap: "0.5rem" }}>
        <button
          className={`btn ${filter === "all" ? "btn-primary" : "btn-secondary"}`}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={`btn ${filter === "active" ? "btn-primary" : "btn-secondary"}`}
          onClick={() => setFilter("active")}
        >
          Active
        </button>
        <button
          className={`btn ${filter === "completed" ? "btn-primary" : "btn-secondary"}`}
          onClick={() => setFilter("completed")}
        >
          Completed
        </button>
      </div>

      {filteredTodos.length === 0 ? (
        <div className="empty-state">
          <h3>No tasks found</h3>
          <p>Add a new task to get started</p>
          <Link to="/add" className="btn btn-primary" style={{ display: "inline-block", marginTop: "1rem" }}>
            Add Task
          </Link>
        </div>
      ) : (
        <div className="todo-list">
          {filteredTodos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} />
          ))}
        </div>
      )}
    </div>
  )
}

export default TodoList
