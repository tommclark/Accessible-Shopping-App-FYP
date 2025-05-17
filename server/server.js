const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.json());

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});



require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, {})
    .then(() => console.log('Connected'))
    .catch((error) => console.error('Failed to connect:', error))


const Item = require('./models/Item');
const User = require('./models/User');

app.post('/register', async (req, res) => {
    try {
        const { userPIN, password } = req.body;

        const isExistingUser = await User.findOne({ userPIN });
        if (isExistingUser) {
            return res.status(400).send('User account already exists');
        }
        const newUser = new User({ userPIN, password });
        await newUser.save();
        res.status(201).send('User account registered successfully!');
    } catch (error) {
        console.error(error);
        res.status(500).send('Registration failed');
    }
})

app.post('/login', async (req, res) => {
    try {
        const { userPIN, password } = req.body;
        const user = await User.findOne({ userPIN });
        if (!user) {
            return res.status(400).json({ error: 'Incorrect PIN or password' });
        }

        const isPasswordCorrect = await user.comparePassword(password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ error: 'Incorrect PIN or password' });
        }
        res.status(200).json({ message: 'Login successful', userPIN, isAdmin : user.isAdmin });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Login failed' });
    }
});


app.get('/add-item', async (req, res) => {
    try {
        const newItem = new Item({
            name: 'Sample Item',
            price: 10.99,
            category: 'Sample Category'
        });
        await newItem.save();
        res.send('Item added successfully!');
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to add item');
    }
});



app.get('/add-item2', async (req, res) => {
    try {
        const newItem = new Item({
            name: 'Sample Item 2',
            price: 599.99,
            category: 'Sample Category'
        });
        await newItem.save();
        res.send('Item added successfully!');

    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to add item');
    }
});

