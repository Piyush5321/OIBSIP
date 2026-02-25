import { Link } from 'react-router-dom'
import './NotFound.css'

export function NotFound() {
  return (
    <div className="not-found">
      <h1>404</h1>
      <p>Page not found.</p>
      <Link to="/">Go to dashboard</Link>
    </div>
  )
}
