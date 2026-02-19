
import express from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Database setup
let db;

(async () => {
  db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT,
      role TEXT,
      displayName TEXT
    );

    CREATE TABLE IF NOT EXISTS requests (
      id TEXT PRIMARY KEY,
      title TEXT,
      description TEXT,
      category TEXT,
      priority TEXT,
      status TEXT,
      name TEXT,
      email TEXT,
      suggestion TEXT,
      createdAt TEXT
    );
  `);
  console.log('Database initialized');
})();

// Routes


// Register
app.post('/api/auth/register', async (req, res) => {
  const { username, password, displayName, role = 'user' } = req.body;

  if (!username || !password || !displayName) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const existingUser = await db.get('SELECT * FROM users WHERE username = ?', [username]);
    if (existingUser) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    await db.run(
      'INSERT INTO users (username, password, role, displayName) VALUES (?, ?, ?, ?)',
      [username, password, role, displayName]
    );

    const newUser = await db.get('SELECT * FROM users WHERE username = ?', [username]);
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await db.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);

  if (user) {
    res.json(user);
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Get all requests
app.get('/api/requests', async (req, res) => {
  const requests = await db.all('SELECT * FROM requests ORDER BY createdAt DESC');
  res.json(requests);
});

// Create request
app.post('/api/requests', async (req, res) => {
  const { id, title, description, category, priority, status, name, email, suggestion, createdAt } = req.body;

  try {
    await db.run(
      `INSERT INTO requests (id, title, description, category, priority, status, name, email, suggestion, createdAt) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, title, description, category, priority, status, name, email, suggestion, createdAt]
    );
    res.status(201).json({ message: 'Request created' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update request status
app.patch('/api/requests/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    await db.run('UPDATE requests SET status = ? WHERE id = ?', [status, id]);
    res.json({ message: 'Status updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
