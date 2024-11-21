const express = require('express');
const db = require('./database');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Routes

// 1. Create an item
app.post('/items', (req, res) => {
	const { name } = req.body;
	db.run('INSERT INTO items (name) VALUES (?)', [name], function (err) {
		if (err) {
			res.status(500).json({ error: err.message });
		} else {
			res.status(201).json({ id: this.lastID, name });
		}
	});
});

app.post('/unsecure/items', (req, res) => {
	db.run(`INSERT INTO items (name) VALUES (${req.body.name})`, function (err) {
		if (err) {
			res.status(500).json({ error: err.message });
		} else {
			res.status(201).json({ id: this.lastID, name: req.body.name });
		}
	});
});

// 2. Get all items
app.get('/items', (req, res) => {
	db.all('SELECT * FROM items', [], (err, rows) => {
		if (err) {
			res.status(500).json({ error: err.message });
		} else {
			res.json(rows);
		}
	});
});

// Start server
app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
