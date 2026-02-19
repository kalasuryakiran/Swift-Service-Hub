
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

(async () => {
    const db = await open({
        filename: './database.sqlite',
        driver: sqlite3.Database
    });


    // Ensure tables exist before seeding
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

    // Clear existing data
    await db.exec('DELETE FROM users');
    await db.exec('DELETE FROM requests');

    // Seed Users
    await db.run(`INSERT INTO users (username, password, role, displayName) VALUES 
    ('admin', 'admin123', 'admin', 'Admin User'),
    ('john', 'john123', 'user', 'John Doe'),
    ('sarah', 'sarah123', 'user', 'Sarah Smith')
  `);

    // Seed Requests
    const now = Date.now();
    await db.run(`INSERT INTO requests (id, title, description, category, priority, status, name, email, suggestion, createdAt) VALUES 
    ('REQ-SEED001', 'WiFi not connecting in Block B', 'The wifi is not working since morning. Multiple users are affected. Urgent fix needed.', 'IT', 'High', 'In Progress', 'Alice Johnson', 'alice@example.com', 'Try restarting your router and reconnecting. If persistent, check if others are affected.', '${new Date(now - 3600000 * 5).toISOString()}'),
    ('REQ-SEED002', 'AC not working in Room 204', 'The air conditioning unit in conference room 204 is broken. It is very hot inside.', 'Facilities', 'Medium', 'Open', 'Bob Martinez', 'bob@example.com', 'Check if the AC settings have been adjusted. Report to Facilities with your room/floor number.', '${new Date(now - 3600000 * 2).toISOString()}'),
    ('REQ-SEED003', 'Salary not credited for December', 'My December salary has not been credited yet. Please look into it.', 'Admin', 'High', 'Resolved', 'Carol White', 'carol@example.com', 'Verify your attendance records. Raise ticket with specific month/details for faster resolution.', '${new Date(now - 3600000 * 24).toISOString()}')
  `);

    console.log('Database seeded successfully');
})();
