/**
 * @file server.js
 * @description This file sets up and configures the Node.js Express API for the Stone and Sod CRM application.
 * It handles user authentication (registration and login) using JWTs, interacts with a PostgreSQL database,
 * and implements role-based access control for protected routes.
 */

// Core module imports
const express = require('express'); // Express.js framework for building web applications
const bodyParser = require('body-parser'); // Middleware to parse incoming request bodies
const jwt = require('jsonwebtoken'); // Library for working with JSON Web Tokens (JWTs)
const bcrypt = require('bcryptjs'); // Library for hashing and comparing passwords
const { Pool } = require('pg'); // PostgreSQL client for Node.js, using a connection pool for efficiency

// Initialize the Express application
const app = express();
const PORT = process.env.PORT || 3001; // Port the API server will listen on, defaults to 3001
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // Secret key for signing and verifying JWTs. IMPORTANT: Use a strong, randomly generated secret in production environments and store it securely (e.g., in environment variables).

// Middleware setup
// Use bodyParser.json() to parse JSON formatted request bodies.
// This allows the API to receive JSON data from clients (e.g., for registration and login).
app.use(bodyParser.json());

// PostgreSQL Connection Pool Configuration
// The connection details are pulled from the DATABASE_URL environment variable,
// which is typically set in the Docker Compose file for containerized environments.
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Test the database connection when the application starts.
// This helps ensure that the API can successfully communicate with the PostgreSQL database.
pool.connect(err => {
    if (err) {
        // Log any errors that occur during the initial database connection attempt.
        console.error('Error connecting to the database:', err);
        return; // Exit if unable to connect to the database
    }
    console.log('Connected to PostgreSQL database'); // Confirm successful database connection
});

/**
 * User Registration Endpoint
 * @route POST /register
 * @description Handles new user registration. It hashes the user's password before storing it
 *              in the database and issues a JWT upon successful registration.
 */
app.post('/register', async (req, res) => {
    // Extract username, password, and optional role from the request body.
    const { username, password, role } = req.body;

    // Validate input: Ensure username and password are provided.
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        // Hash the user's password for security.
        // bcrypt.hash() is an asynchronous function that generates a salt and hashes the password.
        const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds, a higher number increases security but takes more time.

        // SQL query to insert a new user into the 'users' table.
        // $1, $2, $3 are placeholders for parameterized queries to prevent SQL injection.
        // RETURNING id fetches the newly generated user ID.
        const sql = 'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING id';
        // Values to be inserted: username, hashed password, and role (defaults to 'user' if not provided).
        const values = [username, hashedPassword, role || 'user'];
        // Execute the SQL query using the connection pool.
        const result = await pool.query(sql, values);
        const userId = result.rows[0].id; // Extract the new user's ID from the query result.

        // Generate a JSON Web Token (JWT) for the newly registered user.
        // The token contains user information (id, username, role) and is signed with JWT_SECRET.
        // It expires in 1 hour ('1h').
        const token = jwt.sign(
            { id: userId, username: username, role: role || 'user' },
            JWT_SECRET,
            { expiresIn: '1h' } // Token expiration time
        );
        // Send a success response with a message, user ID, and the generated token.
        res.status(201).json({ message: 'User registered successfully', userId: userId, token });
    } catch (error) {
        // Error handling for registration.
        // Check for a unique violation error (PostgreSQL error code '23505') which indicates a duplicate username.
        if (error.code === '23505') {
            return res.status(409).json({ message: 'Username already exists' });
        }
        // Log other unexpected errors and send a generic internal server error response.
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

/**
 * User Login Endpoint
 * @route POST /login
 * @description Authenticates a user by verifying their username and password.
 *              Issues a JWT upon successful authentication.
 */
app.post('/login', async (req, res) => {
    // Extract username and password from the request body.
    const { username, password } = req.body;

    // Validate input: Ensure username and password are provided.
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        // Query the database to find the user by username.
        const sql = 'SELECT * FROM users WHERE username = $1';
        const { rows } = await pool.query(sql, [username]);

        // Check if a user with the provided username exists.
        if (rows.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = rows[0]; // Get the user record from the query result.
        // Compare the provided password with the hashed password stored in the database.
        const isMatch = await bcrypt.compare(password, user.password);

        // If passwords do not match, return an invalid credentials error.
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate a JWT for the authenticated user.
        // The token contains user information (id, username, role) and is signed with JWT_SECRET.
        // It expires in 1 hour ('1h').
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            JWT_SECRET,
            { expiresIn: '1h' } // Token expiration time
        );

        // Send a success response with a message and the generated token.
        res.json({ message: 'Logged in successfully', token });
    } catch (error) {
        // Log any errors that occur during the login process and send a generic internal server error response.
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

/**
 * Middleware for JWT Verification
 * @function authenticateToken
 * @description This middleware verifies the authenticity of a JWT provided in the
 *              'Authorization' header. If the token is valid, it decodes the user
 *              information and attaches it to the request object (req.user).
 *              Otherwise, it sends appropriate error responses (401 for no token,
 *              403 for invalid token).
 */
const authenticateToken = (req, res, next) => {
    // Extract the 'Authorization' header from the request.
    const authHeader = req.headers['authorization'];
    // Extract the token from the header (format: "Bearer <token>").
    const token = authHeader && authHeader.split(' ')[1];

    // If no token is provided, send a 401 Unauthorized status.
    if (token == null) return res.sendStatus(401); // No token

    // Verify the token using the JWT_SECRET.
    jwt.verify(token, JWT_SECRET, (err, user) => {
        // If verification fails (e.g., token is expired or invalid), send a 403 Forbidden status.
        if (err) return res.sendStatus(403); // Invalid token
        // If verification is successful, attach the decoded user payload to the request object.
        req.user = user;
        // Proceed to the next middleware or route handler.
        next();
    });
};

/**
 * Middleware for Role-Based Access Control (RBAC)
 * @function authorizeRoles
 * @param {...string} roles - A list of roles that are allowed to access the route.
 * @description This middleware checks if the authenticated user (from req.user, set by authenticateToken)
 *              has one of the specified allowed roles. If the user does not have the required role,
 *              it sends a 403 Forbidden response.
 */
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        // Check if user information is available (meaning authenticateToken ran successfully)
        // and if the user's role is included in the list of allowed roles.
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
        }
        // If the user has the required role, proceed to the next middleware or route handler.
        next();
    };
};

/**
 * Protected Route Example
 * @route GET /protected
 * @description An example route that requires JWT authentication. Any authenticated user can access this.
 */
app.get('/protected', authenticateToken, (req, res) => {
    // Respond with a personalized message using the authenticated user's username.
    res.json({ message: `Welcome, ${req.user.username}! You have access to protected data.` });
});

/**
 * Admin-only Route Example
 * @route GET /admin
 * @description An example route that requires the user to have the 'admin' role.
 */
app.get('/admin', authenticateToken, authorizeRoles('admin'), (req, res) => {
    // Respond with a message indicating admin-only access.
    res.json({ message: `Welcome, Admin ${req.user.username}! This is an admin-only area.` });
});

/**
 * Manager-only Route Example
 * @route GET /manager
 * @description An example route that requires the user to have either the 'manager' or 'admin' role.
 */
app.get('/manager', authenticateToken, authorizeRoles('manager', 'admin'), (req, res) => {
    // Respond with a message indicating manager-only access.
    res.json({ message: `Welcome, Manager ${req.user.username}! This is a manager-only area.` });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
