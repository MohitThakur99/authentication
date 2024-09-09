//routes.js

import express from 'express';
import { registerUser, loginUser } from '../controllers/user/index.js';

const router = express.Router();

// Register route
router.post('/register', async (req, res) => {
    const { name,email, password, role } = req.body;
    try {
        await registerUser(name,email, password, role);
        res.status(201).json({ message: 'User registered successfully.' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const data = await loginUser(email, password);
        res.status(200).json({ message: 'Login successful.', token: data.token });
    } catch (err) {
        res.status(401).json({ message: err.message });
    }
});



export default router;
