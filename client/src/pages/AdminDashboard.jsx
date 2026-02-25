import { useState, useEffect } from 'react'
import { orders as ordersApi, inventory as inventoryApi } from '../api/client'
import './Dashboard.css'

const STATUS_OPTIONS = ['placed', 'in_kitchen', 'sent_to_delivery', 'delivered']

export function AdminDashboard() {
  const [orders, setOrders] = useState([])
  const [inventory, setInventory] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(null)
  const [invUpdating, setInvUpdating] = useState(null)

  const load = () => {
    setLoading(true)
    Promise.all([ordersApi.list(), inventoryApi.list()])
      .then(([ordersRes, invRes]) => {
        // Filter out delivered orders from the main dashboard
        const activeOrders = ordersRes.data.filter(o => o.status !== 'delivered')
        setOrders(activeOrders)
        setInventory(invRes.data)
      })
      .catch(() => { })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const updateOrderStatus = async (orderId, status) => {
    setUpdating(orderId)
    try {
      console.log(`Updating order ${orderId} to status: ${status}`)
      const res = await ordersApi.updateStatus(orderId, status)
      console.log('Update response:', res)
      load()
    } catch (error) {
      console.error('Error updating order:', error)
    } finally {
      setUpdating(null)
    }
  }

  const updateInventoryItem = async (id, field, value) => {
    setInvUpdating(id)
    try {
      await inventoryApi.update(id, { [field]: Number(value) })
      load()
    } finally {
      setInvUpdating(null)
    }
  }

  if (loading) return <div className="dashboard"><div className="loading">Loading...</div></div>

  return (
    <div className="dashboard">
      <h1>Admin dashboard</h1>

      <section className="section">
        <h2>Orders</h2>
        {orders.length === 0 ? (
          <p className="muted">No active orders.</p>
        ) : (
          <div className="orders-list admin-orders">
            {orders.map((o) => (
              <div key={o._id} className="order-card">
                <div className="order-meta">
                  <span>#{o._id.slice(-6)}</span>
                  <span>{o.user?.name || o.user?.email || '—'}</span>
                  <span>₹{o.totalAmount}</span>
                  <span className="order-status">{o.status}</span>
                </div>
                <ul>
                  {o.items?.map((it, i) => (
                    <li key={i}>
                      {it.pizzaName}: {it.base}, {it.sauce}, {it.cheese} × {it.quantity}
                    </li>
                  ))}
                </ul>
                <div className="order-actions">
                  <label>Status:</label>
                  <select
                    value={o.status}
                    onChange={(e) => updateOrderStatus(o._id, e.target.value)}
                    disabled={updating === o._id}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="section">
        <h2>Inventory</h2>
        {inventory.length === 0 ? (
          <p className="muted">No inventory items. Add via database or seed.</p>
        ) : (
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Name</th>
                <th>Quantity</th>
                <th>Threshold</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => (
                <tr key={item._id} className={item.quantity <= item.threshold ? 'low-stock' : ''}>
                  <td>{item.itemType}</td>
                  <td>{item.name}</td>
                  <td>
                    <input
                      type="number"
                      min={0}
                      defaultValue={item.quantity}
                      onBlur={(e) => {
                        const v = e.target.value
                        if (v !== String(item.quantity)) updateInventoryItem(item._id, 'quantity', v)
                      }}
                      disabled={invUpdating === item._id}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      min={0}
                      defaultValue={item.threshold}
                      onBlur={(e) => {
                        const v = e.target.value
                        if (v !== String(item.threshold)) updateInventoryItem(item._id, 'threshold', v)
                      }}
                      disabled={invUpdating === item._id}
                    />
                  </td>
                  <td>
                    {item.quantity <= item.threshold && (
                      <span className="badge low">Low stock</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  )
}
