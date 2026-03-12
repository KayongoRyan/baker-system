import { useState, useEffect } from 'react'
import { getProducts, getOrders, createOrder, updateOrderStatus } from '../api'

function POS() {
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [cart, setCart] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState('')

  useEffect(() => {
    getProducts().then(res => setProducts(res.data)).catch(() => setProducts([]))
    loadOrders()
  }, [])

  const loadOrders = () => {
    getOrders({ limit: 20 }).then(res => setOrders(res.data)).catch(() => setOrders([]))
  }

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

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

  const handleSubmitOrder = async () => {
    if (cart.length === 0) return
    setLoading(true)
    try {
      await createOrder({
        items: cart.map(c => ({
          productId: c.productId,
          productName: c.productName,
          price: c.price,
          quantity: c.quantity,
        })),
      })
      setCart([])
      loadOrders()
    } catch (err) {
      alert(err.response?.data?.error || 'Order failed')
    }
    setLoading(false)
  }

  const handleStatusChange = async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, status)
      loadOrders()
    } catch (err) {
      alert(err.response?.data?.error || 'Update failed')
    }
  }

  const filteredOrders = filter
    ? orders.filter(o => o.status === filter)
    : orders

  return (
    <>
      <h2>Point of Sale</h2>
      <div className="row">
        <div className="col-md-7">
          <input type="text" className="form-control mb-3" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
          <div className="row">
            {filteredProducts.map(product => (
              <div key={product._id} className="col-md-4 col-6 mb-2">
                <div className="card product-card h-100" onClick={() => addToCart(product)}>
                  <div className="card-body p-2 text-center">
                    <h6 className="card-title mb-0">{product.name}</h6>
                    <small className="text-primary">${product.price.toFixed(2)}</small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="col-md-5">
          <div className="card">
            <div className="card-header"><strong>Current Order</strong></div>
            <div className="card-body">
              {cart.length === 0 ? (
                <p className="text-muted">Add items to cart</p>
              ) : (
                <>
                  <ul className="list-group list-group-flush">
                    {cart.map(item => (
                      <li key={item.productId} className="list-group-item d-flex justify-content-between align-items-center py-2">
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
                  <button className="btn btn-success w-100" onClick={handleSubmitOrder} disabled={loading}>Submit Order</button>
                </>
              )}
            </div>
          </div>
          <div className="card mt-3">
            <div className="card-header"><strong>Recent Orders</strong></div>
            <div className="card-body p-2">
              <div className="btn-group mb-2">
                <button className={`btn btn-sm ${filter === '' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setFilter('')}>All</button>
                <button className={`btn btn-sm ${filter === 'pending' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setFilter('pending')}>Pending</button>
                <button className={`btn btn-sm ${filter === 'completed' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setFilter('completed')}>Completed</button>
              </div>
              <ul className="list-group list-group-flush">
                {filteredOrders.slice(0, 10).map(order => (
                  <li key={order._id} className="list-group-item d-flex justify-content-between align-items-center py-2">
                    <span>${order.totalPrice?.toFixed(2)}</span>
                    <span className={`badge bg-${order.status === 'completed' ? 'success' : order.status === 'cancelled' ? 'danger' : 'warning'}`}>{order.status}</span>
                    {order.status !== 'completed' && order.status !== 'cancelled' && (
                      <div>
                        <button className="btn btn-sm btn-outline-success me-1" onClick={() => handleStatusChange(order._id, 'completed')}>Complete</button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleStatusChange(order._id, 'cancelled')}>Cancel</button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default POS
