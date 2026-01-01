require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Explicitly serve index.html for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API Routes

// GET /api/entries
// Fetch all entries, sorted by newest first
app.get('/api/entries', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM entries ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// POST /api/entries
// Create a new entry
app.post('/api/entries', async (req, res) => {
    try {
        const { content } = req.body;
        if (!content || content.trim() === "") {
            return res.status(400).json({ error: "Content cannot be empty" });
        }

        // Simple validation length check
        if (content.length > 500) {
            return res.status(400).json({ error: "Entry too long" });
        }

        const result = await db.query('INSERT INTO entries (content) VALUES (?)', [content]);

        // Handle MySQL result or Mock result
        let newEntry;
        if (result.rows.insertId) {
            // MySQL Metadata
            newEntry = {
                id: result.rows.insertId,
                content: content,
                created_at: new Date() // App-side timestamp approximation
            };
        } else if (Array.isArray(result.rows) && result.rows.length > 0) {
            // Mock or PG style returning array
            newEntry = result.rows[0];
        } else {
            // Fallback
            newEntry = { id: Date.now(), content, created_at: new Date() };
        }

        res.status(201).json(newEntry);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
