import { useState, useEffect } from 'react'
import { orders as ordersApi } from '../api/client'
import { useAuth } from '../context/AuthContext'
import './Dashboard.css'

export function OrderHistory() {
    const { user } = useAuth()
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true)
                console.log('Loading order history for user:', user)
                const res = user?.role === 'admin' ? await ordersApi.history() : await ordersApi.myHistory()
                console.log('Order history response:', res)
                const data = Array.isArray(res.data) ? res.data : res.data?.data || []
                console.log('Processed order history data:', data)
                setOrders(data)
            } catch (error) {
                console.error('Failed to load order history:', error)
                setOrders([])
            } finally {
                setLoading(false)
            }
        }
        if (user) {
            load()
        }
    }, [user])

    if (loading) return <div className="dashboard"><div className="loading">Loading...</div></div>

    return (
        <div className="dashboard">
            <h1>Order History</h1>
            <p className="subtitle">Your delivered orders</p>

            <section className="section">
                {orders.length === 0 ? (
                    <p className="muted">No delivered orders yet.</p>
                ) : (
                    <div className="orders-list">
                        {orders.map((o) => (
                            <div key={o._id} className="order-card">
                                <div className="order-meta">
                                    <span>#{o._id.slice(-6)}</span>
                                    {user?.role === 'admin' && (
                                        <span>{o.user?.name || o.user?.email || '—'}</span>
                                    )}
                                    <span>₹{o.totalAmount}</span>
                                    <span className="order-status delivered">{o.status}</span>
                                    <span className="order-date">
                                        {new Date(o.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <ul>
                                    {o.items?.map((it, i) => (
                                        <li key={i}>
                                            {it.pizzaName}: {it.base}, {it.sauce}, {it.cheese}
                                            {it.veggies?.length ? ` + ${it.veggies.join(', ')}` : ''} × {it.quantity}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    )
}
