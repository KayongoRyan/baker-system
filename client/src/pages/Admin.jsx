import { useState, useEffect } from 'react'
import { getProducts, getProductsAll, createProduct, updateProduct, deleteProduct } from '../api'

function Admin() {
  const [products, setProducts] = useState([])
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', price: '', category: 'general', description: '' })
  const [loading, setLoading] = useState(false)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    loadProducts()
  }, [showAll])

  const loadProducts = async () => {
    try {
      const res = showAll ? await getProductsAll() : await getProducts()
      setProducts(res.data)
    } catch {
      setProducts([])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = { ...form, price: parseFloat(form.price) }
      if (editing) {
        await updateProduct(editing._id, payload)
      } else {
        await createProduct(payload)
      }
      setForm({ name: '', price: '', category: 'general', description: '' })
      setEditing(null)
      loadProducts()
    } catch (err) {
      alert(err.response?.data?.error || 'Save failed')
    }
    setLoading(false)
  }

  const handleEdit = (item) => {
    setEditing(item)
    setForm({
      name: item.name,
      price: item.price,
      category: item.category || 'general',
      description: item.description || '',
    })
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return
    try {
      await deleteProduct(id)
      loadProducts()
    } catch (err) {
      alert(err.response?.data?.error || 'Delete failed')
    }
  }

  const handleCancel = () => {
    setEditing(null)
    setForm({ name: '', price: '', category: 'general', description: '' })
  }

  return (
    <>
      <h2>Menu Management</h2>
      <div className="mb-3">
        <label className="form-check">
          <input type="checkbox" className="form-check-input" checked={showAll} onChange={e => setShowAll(e.target.checked)} />
          Show all (including unavailable)
        </label>
      </div>
      <div className="row">
        <div className="col-md-5">
          <div className="card">
            <div className="card-header">{editing ? 'Edit Product' : 'Add Product'}</div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input type="text" className="form-control" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Price</label>
                  <input type="number" step="0.01" className="form-control" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Category</label>
                  <select className="form-select" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    <option value="general">General</option>
                    <option value="pastry">Pastry</option>
                    <option value="bread">Bread</option>
                    <option value="main">Main</option>
                    <option value="dessert">Dessert</option>
                    <option value="beverage">Beverage</option>
                    <option value="snack">Snack</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea className="form-control" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                </div>
                <button type="submit" className="btn btn-primary me-2" disabled={loading}>{editing ? 'Update' : 'Add'}</button>
                {editing && <button type="button" className="btn btn-secondary" onClick={handleCancel}>Cancel</button>}
              </form>
            </div>
          </div>
        </div>
        <div className="col-md-7">
          <div className="card">
            <div className="card-header">Products</div>
            <ul className="list-group list-group-flush">
              {products.map((item) => (
                <li key={item._id} className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{item.name}</strong> - ${item.price?.toFixed(2)}
                    {!item.isAvailable && <span className="badge bg-secondary ms-2">Unavailable</span>}
                  </div>
                  <div>
                    <button className="btn btn-sm btn-outline-primary me-1" onClick={() => handleEdit(item)}>Edit</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(item._id)}>Delete</button>
                  </div>
                </li>
              ))}
              {products.length === 0 && <li className="list-group-item text-muted">No products</li>}
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}

export default Admin
