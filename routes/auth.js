const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../models/db');

// Display registration form
router.get('/register', (req, res) => {
    if (req.session.user) {
        return res.redirect('/dashboard'); // Redirect logged-in users to dashboard
    }
    res.render('register');
});

// Handle registration logic
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if the email already exists
        const [existingUser] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).send('User already exists');
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user into the database
        await db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword]);

        res.redirect('/login');
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).send('Server error');
    }
});

// Display login form
router.get('/login', (req, res) => {
    if (req.session.user) {
        return res.redirect('/dashboard'); // Redirect logged-in users to dashboard
    }
    res.render('login');
});

// Handle login logic
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length === 0) {
            return res.status(400).send('Invalid credentials');
        }

        const user = rows[0];

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send('Invalid credentials');
        }

        // Store user data in session
        req.session.user = user;
        res.redirect('/dashboard');
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).send('Server error');
    }
});

// Display dashboard (protected route)
router.get('/dashboard', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    res.render('dashboard', { user: req.session.user });
});

// Display profile page
router.get('/profile', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login'); // Redirect if not logged in
    }
    res.render('profile', { user: req.session.user }); // Render profile page
});

// Display cart page
router.get('/cart', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login'); // Redirect if not logged in
    }
    res.render('cart', { user: req.session.user }); // Render cart page
});

// Display categories page
router.get('/categories', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login'); // Redirect if not logged in
    }
    const categories = [
        { name: 'Electronics', image: 'path/to/electronics.jpg' },
        { name: 'Clothing', image: 'path/to/clothing.jpg' },
        { name: 'Home & Kitchen', image: 'path/to/home-kitchen.jpg' },
        { name: 'Beauty & Health', image: 'path/to/beauty-health.jpg' },
    ]; // Sample category data
    res.render('categories', { user: req.session.user, categories }); // Render categories page
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login'); // Redirect to login after logout
});



module.exports = router;
