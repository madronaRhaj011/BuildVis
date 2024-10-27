const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth'); // Auth routes
const app = express();

// Set view engine to EJS
app.set('view engine', 'ejs');

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: 'mysecret',
    resave: false,
    saveUninitialized: true,
}));

// Middleware to check if the user is logged in
app.use((req, res, next) => {
    if (!req.session.user && req.path !== '/register' && req.path !== '/login' && req.path !== '/') {
        return res.redirect('/register');
    }
    next();
});

// Add this route for the landing page
app.get('/', (req, res) => {
    res.render('landing'); // Render the landing page EJS template
});

// Add this route for the homepage
app.get('/home', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login'); // If the user is not logged in, redirect to login
    }
    res.render('home', { user: req.session.user }); // Pass the user data to the EJS template
});

// Add route for profile page
app.get('/profile', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login'); // If the user is not logged in, redirect to login
    }
    res.render('profile', { user: req.session.user }); // Pass user data to the profile EJS template
});

// Add route for cart page
app.get('/cart', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login'); // If the user is not logged in, redirect to login
    }
    res.render('cart', { user: req.session.user }); // Pass user data to the cart EJS template
});

// Add route for categories page
app.get('/categories', (req, res) => {
    const categories = [
        { name: 'Electronics', image: 'path/to/electronics.jpg' },
        { name: 'Clothing', image: 'path/to/clothing.jpg' },
        { name: 'Home & Kitchen', image: 'path/to/home-kitchen.jpg' },
        { name: 'Beauty & Health', image: 'path/to/beauty-health.jpg' },
    ]; // Example category data
    res.render('categories', { categories }); // Pass categories data to the categories EJS template
});

// Routes
app.use('/', authRoutes);

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
