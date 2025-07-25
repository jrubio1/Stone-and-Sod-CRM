/**
 * @file server.js
 * @description This file sets up and configures the Node.js Express API for the Stone and Sod CRM application.
 * It handles user authentication (registration and login) using JWTs, interacts with a PostgreSQL database,
 * and implements role-based access control for protected routes.
 */

// Core module imports
const crypto = require('crypto');
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
 * Company Registration Endpoint
 * @route POST /company
 * @description Handles new company registration and creates an admin user for the company.
 */
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
 * User Invitation Endpoint
 * @route POST /invite
 * @description Allows an admin to invite a new user to their company.
 */
app.post('/invite', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    console.log('Received invitation request');
    const { email, role } = req.body;
    const { companyId } = req.user;

    if (!email || !role) {
        return res.status(400).json({ message: 'Email and role are required' });
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Check if a user with this email already exists
        const userCheckSql = 'SELECT id FROM users WHERE username = $1';
        const userCheckResult = await client.query(userCheckSql, [email]);
        if (userCheckResult.rows.length > 0) {
            await client.query('ROLLBACK');
            return res.status(409).json({ message: 'User with this email already exists' });
        }

        // Check if an active invitation for this email already exists
        const invitationCheckSql = 'SELECT id FROM invitations WHERE email = $1 AND expires_at > NOW()';
        const invitationCheckResult = await client.query(invitationCheckSql, [email]);
        if (invitationCheckResult.rows.length > 0) {
            await client.query('ROLLBACK');
            return res.status(409).json({ message: 'An active invitation for this email already exists' });
        }

        const invitationToken = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

        const sql = 'INSERT INTO invitations (email, company_id, role, token, expires_at) VALUES ($1, $2, $3, $4, $5) RETURNING id';
        const values = [email, companyId, role, invitationToken, expiresAt];
        await client.query(sql, values);

        await client.query('COMMIT');

        // In a real application, you would send an email with this link
        const invitationLink = `${process.env.NEXT_PUBLIC_URL}/register?token=${invitationToken}`;
        console.log(`Invitation link for ${email}: ${invitationLink}`);

        res.status(200).json({ message: 'Invitation sent successfully' });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error sending invitation:', error);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        client.release();
    }
});

/**
 * Company and Admin User Registration Endpoint
 * @route POST /register
 * @description Handles new company registration and creates an admin user for the company.
 */
app.post('/register', async (req, res) => {
    const { companyName, username, password } = req.body;

    if (!companyName || !username || !password) {
        return res.status(400).json({ message: 'Company name, username, and password are required' });
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const companySql = 'INSERT INTO companies (name) VALUES ($1) RETURNING id';
        const companyResult = await client.query(companySql, [companyName]);
        const companyId = companyResult.rows[0].id;

        const hashedPassword = await bcrypt.hash(password, 10);
        const userSql = 'INSERT INTO users (username, password, role, company_id, status) VALUES ($1, $2, $3, $4, $5) RETURNING id';
        const userValues = [username, hashedPassword, 'admin', companyId, 'active'];
        const userResult = await client.query(userSql, userValues);
        const userId = userResult.rows[0].id;

        await client.query('COMMIT');

        const token = jwt.sign(
            { id: userId, username: username, role: 'admin', companyId: companyId },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(201).json({ message: 'Company and admin user registered successfully', userId: userId, companyId: companyId, token });
    } catch (error) {
        await client.query('ROLLBACK');
        if (error.code === '23505') {
            return res.status(409).json({ message: 'Company name or username already exists' });
        }
        console.error('Error registering company:', error);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        client.release();
    }
});

/**
 * User Login Endpoint
 * @route POST /login
 * @description Authenticates a user by verifying their username and password.
 *              Issues a JWT upon successful authentication.
 */
/**
 * Accept Invitation Endpoint
 * @route POST /accept-invite
 * @description Handles user registration via invitation token.
 */
app.post('/accept-invite', async (req, res) => {
    const { token, password } = req.body;

    if (!token || !password) {
        return res.status(400).json({ message: 'Token and password are required' });
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Find the invitation
        const invitationSql = 'SELECT * FROM invitations WHERE token = $1 AND expires_at > NOW()';
        const invitationResult = await client.query(invitationSql, [token]);

        if (invitationResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: 'Invalid or expired invitation token' });
        }

        const invitation = invitationResult.rows[0];

        // Check if a user with this email already exists
        const userCheckSql = 'SELECT id FROM users WHERE username = $1';
        const userCheckResult = await client.query(userCheckSql, [invitation.email]);
        if (userCheckResult.rows.length > 0) {
            await client.query('ROLLBACK');
            return res.status(409).json({ message: 'User with this email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userSql = 'INSERT INTO users (username, password, role, company_id, status) VALUES ($1, $2, $3, $4, $5) RETURNING id, username, role, company_id';
        const userValues = [invitation.email, hashedPassword, invitation.role, invitation.company_id, 'active'];
        const userResult = await client.query(userSql, userValues);

        const user = userResult.rows[0];

        // Delete the invitation after successful registration
        const deleteInvitationSql = 'DELETE FROM invitations WHERE id = $1';
        await client.query(deleteInvitationSql, [invitation.id]);

        await client.query('COMMIT');

        const jwtToken = jwt.sign(
            { id: user.id, username: user.username, role: user.role, companyId: user.company_id },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ message: 'User registered successfully', userId: user.id, token: jwtToken });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error accepting invitation:', error);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        client.release();
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

app.get('/', (req, res) => {
    res.status(200).json({ message: 'API is running' });
});

// Catch-all for 404 Not Found errors
app.use((req, res, next) => {
    res.status(404).json({ message: 'Route not found' });
});

// Generic error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack); // Log the error stack for debugging
    res.status(500).json({ message: 'Internal server error' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
