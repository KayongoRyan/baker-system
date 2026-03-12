import { useState, useEffect } from 'react'
import { getSalesReport, getTopProducts, getSalesOverview, getLowStock } from '../api'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js'
import { Bar, Doughnut } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend)

function Dashboard() {
  const [sales, setSales] = useState({ totalSales: 0, orderCount: 0 })
  const [topProducts, setTopProducts] = useState([])
  const [salesOverview, setSalesOverview] = useState([])
  const [lowStock, setLowStock] = useState([])
  const [days, setDays] = useState(7)

  useEffect(() => {
    loadData()
  }, [days])

  const loadData = async () => {
    try {
      const [salesRes, topRes, overviewRes, lowRes] = await Promise.all([
        getSalesReport(),
        getTopProducts(10),
        getSalesOverview(days),
        getLowStock(),
      ])
      setSales({ totalSales: salesRes.data.totalSales, orderCount: salesRes.data.orderCount })
      setTopProducts(topRes.data)
      setSalesOverview(overviewRes.data)
      setLowStock(lowRes.data)
    } catch (err) {
      console.error(err)
    }
  }

  const barData = {
    labels: salesOverview.map(d => d._id),
    datasets: [{
      label: 'Sales ($)',
      data: salesOverview.map(d => d.total),
      backgroundColor: 'rgba(75, 192, 192, 0.8)',
    }],
  }

  const doughnutData = {
    labels: topProducts.slice(0, 5).map(p => p.name),
    datasets: [{
      data: topProducts.slice(0, 5).map(p => p.quantity),
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
    }],
  }

  return (
    <>
      <h2>Sales Manager Dashboard</h2>
      <div className="mb-3">
        <select className="form-select w-auto d-inline-block" value={days} onChange={e => setDays(Number(e.target.value))}>
          <option value={7}>Last 7 days</option>
          <option value={14}>Last 14 days</option>
          <option value={30}>Last 30 days</option>
        </select>
      </div>
      <div className="row">
        <div className="col-md-4 mb-3">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Total Sales</h5>
              <p className="card-text display-6 text-primary">${sales.totalSales?.toFixed(2) || '0.00'}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Total Orders</h5>
              <p className="card-text display-6 text-success">{sales.orderCount || 0}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Low Stock Items</h5>
              <p className="card-text display-6 text-warning">{lowStock.length || 0}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-8 mb-3">
          <div className="card">
            <div className="card-header">Sales Overview</div>
            <div className="card-body">
              {salesOverview.length > 0 ? (
                <Bar data={barData} options={{ responsive: true }} />
              ) : (
                <p className="text-muted">No sales data yet</p>
              )}
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card">
            <div className="card-header">Top Products</div>
            <div className="card-body">
              {topProducts.length > 0 ? (
                <Doughnut data={doughnutData} options={{ responsive: true }} />
              ) : (
                <p className="text-muted">No product data yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">Top Products by Quantity</div>
            <ul className="list-group list-group-flush">
              {topProducts.map((p, i) => (
                <li key={i} className="list-group-item d-flex justify-content-between">
                  <span>{p.name}</span>
                  <span>{p.quantity} sold</span>
                </li>
              ))}
              {topProducts.length === 0 && <li className="list-group-item text-muted">No data</li>}
            </ul>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">Low Stock Alerts</div>
            <ul className="list-group list-group-flush">
              {lowStock.map((item, i) => (
                <li key={i} className="list-group-item d-flex justify-content-between">
                  <span>{item.productId?.name || 'Product'}</span>
                  <span className="text-danger">{item.quantity} left</span>
                </li>
              ))}
              {lowStock.length === 0 && <li className="list-group-item text-muted">All stocked</li>}
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}

export default Dashboard
