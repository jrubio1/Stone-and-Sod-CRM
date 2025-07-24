const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // Use a strong secret in production

// Middleware
app.use(bodyParser.json());

// PostgreSQL Connection Pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

pool.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to PostgreSQL database');
});

// User Registration
app.post('/register', async (req, res) => {
    const { username, password, role } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = 'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING id';
        const values = [username, hashedPassword, role || 'user'];
        const result = await pool.query(sql, values);
        const userId = result.rows[0].id;

        const token = jwt.sign(
            { id: userId, username: username, role: role || 'user' },
            JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.status(201).json({ message: 'User registered successfully', userId: userId, token });
    } catch (error) {
        if (error.code === '23505') { // Unique violation error code for PostgreSQL
            return res.status(409).json({ message: 'Username already exists' });
        }
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// User Login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        const sql = 'SELECT * FROM users WHERE username = $1';
        const { rows } = await pool.query(sql, [username]);

        if (rows.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ message: 'Logged in successfully', token });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Middleware for JWT verification
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401); // No token

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // Invalid token
        req.user = user;
        next();
    });
};

// Middleware for Role-Based Access Control
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
        }
        next();
    };
};

// Protected Route Example
app.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: `Welcome, ${req.user.username}! You have access to protected data.` });
});

// Admin-only Route Example
app.get('/admin', authenticateToken, authorizeRoles('admin'), (req, res) => {
    res.json({ message: `Welcome, Admin ${req.user.username}! This is an admin-only area.` });
});

// Manager-only Route Example
app.get('/manager', authenticateToken, authorizeRoles('manager', 'admin'), (req, res) => {
    res.json({ message: `Welcome, Manager ${req.user.username}! This is a manager-only area.` });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});