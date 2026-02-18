import React, { useEffect, useState } from 'react'
import { apiBase } from '../App'

export default function Tasks() {
  const [tasks, setTasks] = useState([])
  const [text, setText] = useState('')

  useEffect(() => {
    fetchTasks()
  }, [])

  function fetchTasks() {
    fetch(`${apiBase}/api/tasks`)
      .then(r => r.json())
      .then(data => setTasks(data || []))
  }

  function addTask(e) {
    e.preventDefault()
    if (!text.trim()) return
    fetch(`${apiBase}/api/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    })
      .then(r => r.json())
      .then(() => {
        setText('')
        fetchTasks()
      })
  }

  function toggle(id) {
    fetch(`${apiBase}/api/tasks/${id}/toggle`, { method: 'PUT' })
      .then(() => fetchTasks())
  }

  function remove(id) {
    fetch(`${apiBase}/api/tasks/${id}`, { method: 'DELETE' })
      .then(() => fetchTasks())
  }

  return (
    <div>
      <form onSubmit={addTask} className="task-form">
        <input value={text} onChange={e => setText(e.target.value)} placeholder="New task" />
        <button type="submit">Add</button>
      </form>
      <ul className="task-list">
        {tasks.map(t => (
          <li key={t.id} className={t.done ? 'done' : ''}>
            <label>
              <input type="checkbox" checked={t.done} onChange={() => toggle(t.id)} />
              <span>{t.text}</span>
            </label>
            <button className="remove" onClick={() => remove(t.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
