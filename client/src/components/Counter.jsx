import React, { useEffect, useState } from 'react'
import { apiBase } from '../App'

export default function Counter() {
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${apiBase}/api/counter`)
      .then(r => r.json())
      .then(data => setCount(data.count || 0))
      .finally(() => setLoading(false))
  }, [])

  function increment() {
    fetch(`${apiBase}/api/counter/increment`, { method: 'POST' })
      .then(r => r.json())
      .then(data => setCount(data.count))
  }

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <div className="count">{count}</div>
      <button onClick={increment}>Increment</button>
    </div>
  )
}
