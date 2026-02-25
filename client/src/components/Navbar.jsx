import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

export function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        PizzaWizza
      </Link>
      <div className="navbar-links">
        {user ? (
          <>
            <span className="navbar-user">{user.name} ({user.role})</span>
            {user.role === 'admin' && (
              <Link to="/admin">Admin</Link>
            )}
            <Link to="/">Dashboard</Link>
            <button type="button" className="btn-logout" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  )
}
