import { useState, useEffect } from 'react'
import { getProducts, createOrder, createUser } from '../api'

function Home() {
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])
  const [search, setSearch] = useState('')
  const [user, setUser] = useState({ username: '', email: '', password: '', address: '' })
  const [step, setStep] = useState('register')
  const [loading, setLoading] = useState(false)
  const [orderId, setOrderId] = useState(null)

  useEffect(() => {
    getProducts().then(res => setProducts(res.data)).catch(() => setProducts([]))
  }, [])

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await createUser(user)
      setStep('shop')
    } catch (err) {
      alert(err.response?.data?.error || 'Registration failed')
    }
    setLoading(false)
  }

  const addToCart = (product, qty = 1) => {
    const existing = cart.find(c => c.productId === product._id)
    if (existing) {
      setCart(cart.map(c =>
        c.productId === product._id
          ? { ...c, quantity: c.quantity + qty, totalPrice: (c.quantity + qty) * product.price }
          : c
      ))
    } else {
      setCart([...cart, {
        productId: product._id,
        productName: product.name,
        price: product.price,
        quantity: qty,
        totalPrice: qty * product.price,
      }])
    }
  }

  const updateQuantity = (productId, delta) => {
    setCart(cart.map(c => {
      if (c.productId !== productId) return c
      const newQty = Math.max(0, c.quantity + delta)
      if (newQty === 0) return null
      return { ...c, quantity: newQty, totalPrice: newQty * c.price }
    }).filter(Boolean))
  }

  const total = cart.reduce((sum, c) => sum + c.totalPrice, 0)

  const handleCheckout = async () => {
    if (cart.length === 0) return
    setLoading(true)
    try {
      const res = await createOrder({
        items: cart.map(c => ({
          productId: c.productId,
          productName: c.productName,
          price: c.price,
          quantity: c.quantity,
        })),
      })
      setOrderId(res.data._id)
      setCart([])
    } catch (err) {
      alert(err.response?.data?.error || 'Order failed')
    }
    setLoading(false)
  }

  if (step === 'register') {
    return (
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2>Welcome to Grand Ville Bakery</h2>
          <form onSubmit={handleRegister}>
            <div className="mb-3">
              <label className="form-label">Username</label>
              <input type="text" className="form-control" value={user.username} onChange={e => setUser({ ...user, username: e.target.value })} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" value={user.email} onChange={e => setUser({ ...user, email: e.target.value })} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input type="password" className="form-control" value={user.password} onChange={e => setUser({ ...user, password: e.target.value })} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Address</label>
              <textarea className="form-control" value={user.address} onChange={e => setUser({ ...user, address: e.target.value })} />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>Continue to Shop</button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <>
      <h2>Order</h2>
      <div className="mb-3">
        <input type="text" className="form-control" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <div className="row">
        <div className="col-md-8">
          <div className="row">
            {filteredProducts.map(product => (
              <div key={product._id} className="col-md-4 mb-3">
                <div className="card product-card h-100">
                  <div className="card-body">
                    <h5 className="card-title">{product.name}</h5>
                    <p className="card-text text-muted small">{product.description}</p>
                    <p className="card-text text-primary fw-bold">${product.price.toFixed(2)}</p>
                    <button className="btn btn-success btn-sm" onClick={() => addToCart(product)}>Add to Cart</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-header"><strong>Your Cart</strong></div>
            <div className="card-body">
              {cart.length === 0 ? (
                <p className="text-muted">Cart is empty</p>
              ) : (
                <>
                  <ul className="list-group list-group-flush">
                    {cart.map(item => (
                      <li key={item.productId} className="list-group-item d-flex justify-content-between align-items-center">
                        <span>{item.productName} x{item.quantity}</span>
                        <div>
                          <button className="btn btn-sm btn-outline-secondary me-1" onClick={() => updateQuantity(item.productId, -1)}>-</button>
                          <button className="btn btn-sm btn-outline-secondary" onClick={() => updateQuantity(item.productId, 1)}>+</button>
                        </div>
                        <span>${item.totalPrice.toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                  <hr />
                  <p className="fw-bold">Total: ${total.toFixed(2)}</p>
                  <button className="btn btn-primary w-100" onClick={handleCheckout} disabled={loading}>Checkout</button>
                </>
              )}
            </div>
          </div>
          {orderId && (
            <div className="alert alert-success mt-2">Order #{orderId.slice(-6)} placed successfully!</div>
          )}
        </div>
      </div>
    </>
  )
}

export default Home
