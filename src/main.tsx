import React from "react"
import ReactDOM from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import App from "./App"
import TodoList from "./components/TodoList"
import AddTodo from "./components/AddTodo"
import EditTodo from "./components/EditTodo"
import "./index.css"

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <TodoList />,
      },
      {
        path: "add",
        element: <AddTodo />,
      },
      {
        path: "edit/:id",
        element: <EditTodo />,
      },
    ],
  },
])

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
