import { useState, useEffect } from 'react'
import { PizzaBuilder } from '../components/PizzaBuilder'
import { pizzas as pizzasApi, orders as ordersApi } from '../api/client'
import './Dashboard.css'

function PreMadePizzaCard({ pizza: p, onAddToCart }) {
  const [qty, setQty] = useState(1)
  return (
    <div className="pizza-card pizza-card-premade">
      <h3>{p.name}</h3>
      {p.description && <p className="pizza-card-desc">{p.description}</p>}
      <p className="pizza-card-price">₹{p.basePrice}</p>
      <div className="pizza-card-actions">
        <label className="pizza-card-qty-label">
          Qty
          <input
            type="number"
            min={1}
            value={qty}
            onChange={(e) => setQty(Math.max(1, parseInt(e.target.value, 10) || 1))}
            className="pizza-card-qty"
          />
        </label>
        <button type="button" className="btn-add-premade" onClick={() => onAddToCart(p, qty)}>
          Add to cart
        </button>
      </div>
    </div>
  )
}

export function UserDashboard() {
  const [pizzaVarieties, setPizzaVarieties] = useState([])
  const [cart, setCart] = useState([])
  const [myOrders, setMyOrders] = useState([])
  const [loadingOrders, setLoadingOrders] = useState(false)
  const [placing, setPlacing] = useState(false)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    pizzasApi.list().then(({ data }) => setPizzaVarieties(data)).catch(() => setPizzaVarieties([]))
  }, [])

  useEffect(() => {
    setLoadingOrders(true)
    ordersApi
      .my()
      .then(({ data }) => setMyOrders(data))
      .catch(() => setMyOrders([]))
      .finally(() => setLoadingOrders(false))
  }, [])

  const addToCart = (item) => {
    setCart((c) => [...c, item])
  }

  const removeFromCart = (index) => {
    setCart((c) => c.filter((_, i) => i !== index))
  }

  const cartTotal = cart.reduce((sum, i) => sum + (i.price || 0), 0)

  const placeOrder = async () => {
    if (cart.length === 0) {
      setMessage('Cart is empty')
      return
    }
    setPlacing(true)
    setMessage(null)
    try {
      await ordersApi.create({
        items: cart.map(({ pizzaName, base, sauce, cheese, veggies, quantity, price }) => ({
          pizzaName,
          base,
          sauce,
          cheese,
          veggies: veggies || [],
          quantity,
          price,
        })),
        totalAmount: cartTotal,
      })
      setCart([])
      setMessage('Order placed successfully!')
      ordersApi.my().then(({ data }) => setMyOrders(data))
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to place order')
    } finally {
      setPlacing(false)
    }
  }

  const statusLabel = (s) =>
    ({ placed: 'Placed', in_kitchen: 'In kitchen', sent_to_delivery: 'Sent to delivery', delivered: 'Delivered', cancelled: 'Cancelled' }[s] || s)

  const preMadePizzas = pizzaVarieties.filter((p) => p.fixedBase && p.basePrice != null)

  const addPreMadeToCart = (p, quantity = 1) => {
    if (quantity < 1) return
    addToCart({
      pizzaName: p.name,
      base: p.fixedBase,
      sauce: p.fixedSauce,
      cheese: p.fixedCheese,
      veggies: p.fixedVeggies || [],
      quantity,
      price: p.basePrice * quantity,
    })
  }

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <p className="subtitle">Choose a ready-made pizza or build your own.</p>

      {preMadePizzas.length > 0 && (
        <section className="section">
          <h2>Pre-made varieties</h2>
          <div className="pizza-grid">
            {preMadePizzas.map((p) => (
              <PreMadePizzaCard key={p._id} pizza={p} onAddToCart={addPreMadeToCart} />
            ))}
          </div>
        </section>
      )}

      <section className="section">
        <PizzaBuilder onAddToCart={addToCart} />
      </section>

      <section className="section cart-section">
        <h2>Cart</h2>
        {cart.length === 0 ? (
          <p className="muted">Cart is empty. Add a pizza above.</p>
        ) : (
          <>
            <ul className="cart-list">
              {cart.map((item, i) => (
                <li key={i}>
                  {item.pizzaName} – {item.base}, {item.sauce}, {item.cheese}
                  {item.veggies?.length ? ` + ${item.veggies.join(', ')}` : ''} × {item.quantity} = ₹{item.price}
                  <button type="button" className="btn-remove" onClick={() => removeFromCart(i)}>
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            <div className="cart-footer">
              <strong>Total: ₹{cartTotal}</strong>
              <button type="button" className="btn-place" onClick={placeOrder} disabled={placing}>
                {placing ? 'Placing...' : 'Place order'}
              </button>
            </div>
          </>
        )}
        {message && <div className="message">{message}</div>}
      </section>

      <section className="section">
        <h2>My orders</h2>
        {loadingOrders ? (
          <p className="muted">Loading...</p>
        ) : myOrders.length === 0 ? (
          <p className="muted">No orders yet.</p>
        ) : (
          <div className="orders-list">
            {myOrders.map((o) => (
              <div key={o._id} className="order-card">
                <div className="order-meta">
                  <span>#{o._id.slice(-6)}</span>
                  <span className="order-status">{statusLabel(o.status)}</span>
                  <span>₹{o.totalAmount}</span>
                </div>
                <ul>
                  {o.items?.map((it, i) => (
                    <li key={i}>
                      {it.pizzaName}: {it.base}, {it.sauce}, {it.cheese} × {it.quantity}
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
