const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

// Logging middleware: log requests and JSON responses
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  if (req.method === 'POST' || req.method === 'PUT') {
    console.log('  Request body:', req.body);
  }
  const oldJson = res.json.bind(res);
  res.json = (body) => {
    try {
      console.log('  Response body:', JSON.stringify(body));
    } catch (e) {
      console.log('  Response body: [unserializable]');
    }
    return oldJson(body);
  };
  next();
});

let counter = 0;
let tasks = [];
let nextTaskId = 1;

// Counter endpoints
app.get('/api/counter', (req, res) => {
  res.json({ count: counter });
});

app.post('/api/counter/increment', (req, res) => {
  counter += 1;
  res.json({ count: counter });
});

// Tasks endpoints
app.get('/api/tasks', (req, res) => {
  res.json(tasks);
});

app.post('/api/tasks', (req, res) => {
  const { text } = req.body;
  if (!text || !text.trim()) return res.status(400).json({ error: 'Task text required' });
  const task = { id: nextTaskId++, text: text.trim(), done: false };
  tasks.push(task);
  res.status(201).json(task);
});

app.put('/api/tasks/:id/toggle', (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find(t => t.id === id);
  if (!task) return res.status(404).json({ error: 'Not found' });
  task.done = !task.done;
  res.json(task);
});

app.delete('/api/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const before = tasks.length;
  tasks = tasks.filter(t => t.id !== id);
  if (tasks.length === before) return res.status(404).json({ error: 'Not found' });
  res.status(204).end();
});

// Root route for quick sanity check
app.get('/', (req, res) => {
  res.send('API running. Use /api/counter and /api/tasks endpoints.');
});

// State endpoint: return both counter and tasks for frontend inspection
app.get('/api/state', (req, res) => {
  res.json({ counter, tasks });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
