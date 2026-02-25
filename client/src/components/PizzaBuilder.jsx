import { useState, useEffect } from 'react'
import { pizzas as pizzasApi } from '../api/client'
import './PizzaBuilder.css'

const DEFAULT_OPTIONS = {
  baseOptions: [],
  sauceOptions: [],
  cheeseOptions: [],
  veggieOptions: [],
}

export function PizzaBuilder({ onAddToCart }) {
  const [options, setOptions] = useState(DEFAULT_OPTIONS)
  const [loading, setLoading] = useState(true)
  const [selection, setSelection] = useState({
    base: null,
    sauce: null,
    cheese: null,
    veggies: [],
  })
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    pizzasApi.list()
      .then(({ data }) => {
        if (data.length) {
          const customTemplate = data.find((p) => p.baseOptions?.length) || data[0]
          setOptions({
            baseOptions: customTemplate.baseOptions || [],
            sauceOptions: customTemplate.sauceOptions || [],
            cheeseOptions: customTemplate.cheeseOptions || [],
            veggieOptions: customTemplate.veggieOptions || [],
          })
          setSelection((s) => ({
            ...s,
            base: customTemplate.baseOptions?.[0] || null,
            sauce: customTemplate.sauceOptions?.[0] || null,
            cheese: customTemplate.cheeseOptions?.[0] || null,
            veggies: [],
          }))
        }
      })
      .catch(() => setOptions(DEFAULT_OPTIONS))
      .finally(() => setLoading(false))
  }, [])

  const toggleVeggie = (v) => {
    setSelection((s) => ({
      ...s,
      veggies: s.veggies.includes(v.name)
        ? s.veggies.filter((x) => x !== v.name)
        : [...s.veggies, v.name],
    }))
  }

  const price =
    (selection.base?.price || 0) +
    (selection.sauce?.price || 0) +
    (selection.cheese?.price || 0) +
    selection.veggies.reduce(
      (sum, name) =>
        sum + (options.veggieOptions.find((o) => o.name === name)?.price || 0),
      0
    )

  const total = price * quantity

  const handleAdd = () => {
    if (!selection.base || !selection.sauce || !selection.cheese) return
    onAddToCart({
      pizzaName: 'Custom Pizza',
      base: selection.base.name,
      sauce: selection.sauce.name,
      cheese: selection.cheese.name,
      veggies: selection.veggies,
      quantity,
      price: total,
    })
    setQuantity(1)
  }

  if (loading) return <div className="pizza-builder-loading">Loading options...</div>

  const hasOptions =
    options.baseOptions.length ||
    options.sauceOptions.length ||
    options.cheeseOptions.length

  if (!hasOptions) {
    return (
      <div className="pizza-builder-empty">
        No pizza options available yet. Ask admin to add options.
      </div>
    )
  }

  return (
    <div className="pizza-builder">
      <h3>Build your pizza</h3>

      {options.baseOptions.length > 0 && (
        <section>
          <label>Base</label>
          <div className="options-row">
            {options.baseOptions.map((b) => (
              <button
                key={b.name}
                type="button"
                className={selection.base?.name === b.name ? 'active' : ''}
                onClick={() => setSelection((s) => ({ ...s, base: b }))}
              >
                {b.name} {b.price > 0 && `(+₹${b.price})`}
              </button>
            ))}
          </div>
        </section>
      )}

      {options.sauceOptions.length > 0 && (
        <section>
          <label>Sauce</label>
          <div className="options-row">
            {options.sauceOptions.map((s) => (
              <button
                key={s.name}
                type="button"
                className={selection.sauce?.name === s.name ? 'active' : ''}
                onClick={() => setSelection((sel) => ({ ...sel, sauce: s }))}
              >
                {s.name} {s.price > 0 && `(+₹${s.price})`}
              </button>
            ))}
          </div>
        </section>
      )}

      {options.cheeseOptions.length > 0 && (
        <section>
          <label>Cheese</label>
          <div className="options-row">
            {options.cheeseOptions.map((c) => (
              <button
                key={c.name}
                type="button"
                className={selection.cheese?.name === c.name ? 'active' : ''}
                onClick={() => setSelection((sel) => ({ ...sel, cheese: c }))}
              >
                {c.name} {c.price > 0 && `(+₹${c.price})`}
              </button>
            ))}
          </div>
        </section>
      )}

      {options.veggieOptions.length > 0 && (
        <section>
          <label>Veggies (optional)</label>
          <div className="options-row">
            {options.veggieOptions.map((v) => (
              <button
                key={v.name}
                type="button"
                className={selection.veggies.includes(v.name) ? 'active' : ''}
                onClick={() => toggleVeggie(v)}
              >
                {v.name} {v.price > 0 && `(+₹${v.price})`}
              </button>
            ))}
          </div>
        </section>
      )}

      <section className="quantity-row">
        <label>Quantity</label>
        <input
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value) || 1)}
        />
      </section>

      <div className="pizza-builder-footer">
        <strong>Total: ₹{total}</strong>
        <button
          type="button"
          className="btn-add"
          onClick={handleAdd}
          disabled={!selection.base || !selection.sauce || !selection.cheese}
        >
          Add to cart
        </button>
      </div>
    </div>
  )
}
