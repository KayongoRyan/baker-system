import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Login() {
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/pos'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(pin)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed')
    }
    setLoading(false)
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-4">
        <div className="card">
          <div className="card-body">
            <h4 className="card-title">Staff Login</h4>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">PIN</label>
                <input
                  type="password"
                  className="form-control"
                  value={pin}
                  onChange={e => setPin(e.target.value)}
                  placeholder="Enter your PIN"
                  maxLength={6}
                  required
                />
              </div>
              {error && <div className="alert alert-danger py-2">{error}</div>}
              <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
            <p className="text-muted small mt-2 mb-0">Demo: manager 1234, cashier 5678</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
