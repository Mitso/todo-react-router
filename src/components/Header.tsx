import { NavLink } from "react-router-dom"

function Header() {
  return (
    <header className="header">
      <h1>NEON TASKS</h1>
      <nav className="nav-links">
        <NavLink to="/" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
          Tasks
        </NavLink>
        <NavLink to="/add" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
          Add Task
        </NavLink>
      </nav>
    </header>
  )
}

export default Header
