import React from 'react'
import Counter from './components/Counter'
import Tasks from './components/Tasks'

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export const apiBase = API

export default function App() {
  return (
    <div className="app">
      <h1>React + Express Lab</h1>
      <div className="cards">
        <section className="card">
          <h2>Counter</h2>
          <Counter />
        </section>
        <section className="card">
          <h2>Tasks</h2>
          <Tasks />
        </section>
      </div>
    </div>
  )
}
