import { Outlet } from "react-router-dom"
import { TodoProvider } from "./context/TodoContext"
import Header from "./components/Header"

function App() {
  return (
    <TodoProvider>
      <div className="app-container">
        <Header />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </TodoProvider>
  )
}

export default App
