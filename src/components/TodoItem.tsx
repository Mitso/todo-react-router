"use client"

import { Link } from "react-router-dom"
import { useTodos } from "../context/TodoContext"
import type { Todo } from "../types"

interface TodoItemProps {
  todo: Todo
}

function TodoItem({ todo }: TodoItemProps) {
  const { toggleTodo, deleteTodo } = useTodos()

  const handleToggle = () => {
    toggleTodo(todo.id)
  }

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      deleteTodo(todo.id)
    }
  }

  return (
    <div className={`todo-item ${todo.completed ? "completed" : ""}`}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <input type="checkbox" className="checkbox" checked={todo.completed} onChange={handleToggle} />
        <div className="todo-text">{todo.title}</div>
      </div>

      <div className="todo-actions">
        <Link to={`/edit/${todo.id}`} className="btn btn-secondary">
          Edit
        </Link>
        <button onClick={handleDelete} className="btn btn-danger">
          Delete
        </button>
      </div>
    </div>
  )
}

export default TodoItem
