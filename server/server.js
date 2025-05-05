const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
}); 



require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, {})
.then(() => console.log('Connected'))
.catch((error) => console.error('Failed to connect:', error))


const Item = require('./models/Item');


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
