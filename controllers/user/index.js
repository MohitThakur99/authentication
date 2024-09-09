// auth/authController.js

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mysql from 'mysql2/promise';

const JWT_SECRET = 'test'; // Replace with your actual secret key

// MySQL Database connection setup
const db = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234', // Replace with your actual password
    database: 'jwt_auth_db'
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to the database.');
});

// Register a new user
export const registerUser = async (name, email, password, role) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO users (name,email, password, role) VALUES (?, ?, ?, ?)';
    
    try {
        const [results] = await db.query(query, [name, email, hashedPassword, role]);
        return results;
    } catch (err) {
        throw new Error('Error registering user.');
    }
};

// Login user
export const loginUser = async (email, password) => {
    const query = 'SELECT * FROM users WHERE email = ?';
    
    try {
        const [results] = await db.query(query, [email]);
        if (results.length === 0) {
            throw new Error('User not found or error occurred.');
        }

        const user = results[0];
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            throw new Error('Invalid password.');
        }

        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1h' });
        return { token };
    } catch (err) {
        throw new Error(err.message);
    }
};
