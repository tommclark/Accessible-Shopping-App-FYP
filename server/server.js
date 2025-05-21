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
const Order = require('./models/Order');

app.post('/order', async (req, res) => {
    try {
        const { userPIN } = req.body;
        const user = await User.findOne({ userPIN });
        const order = new Order({ userPIN, items: user.basket.map(basketItems => ({ item: basketItems.item, quantity: basketItems.quantity })) });
        await order.save();

        user.basket = [];
        await user.save();

        res.status(201).json({ message: 'Order placed' });
    } catch (error) {
        console.error(error);
    }
})

app.get('/orders/:userPIN', async (req, res) => {
    try {
        const orders = await Order.find({ userPIN: req.params.userPIN }).populate('items.item');
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
})

app.get('/freshMeatProducts', async (req, res) => {
    const productCategory = 'Fresh Meat';
    getProducts(productCategory, res);
})

app.get('/freshVegProducts', async (req, res) => {
    const productCategory = 'Fresh Vegetables';
    getProducts(productCategory, res);
})

app.get('/freshOtherProducts', async (req, res) => {
    const productCategory = 'Fresh Other';
    getProducts(productCategory, res);
})


app.get('/frozenMeatProducts', async (req, res) => {
    const productCategory = 'Frozen Meat';
    getProducts(productCategory, res);
})

app.get('/frozenVegProducts', async (req, res) => {
    const productCategory = 'Frozen Vegetables';
    getProducts(productCategory, res);
})

app.get('/frozenOtherProducts', async (req, res) => {
    const productCategory = 'Frozen Other';
    getProducts(productCategory, res);
})


async function getProducts(productCategory, res) {
    try {
        const products = await Item.find({ category: productCategory });
        res.json(products);
    } catch {
        console.error('Error getting products');
        res.status(500).json({ error: 'Failed to get products' });
    }
}

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
        res.status(200).json({ message: 'Login successful', userPIN, isAdmin: user.isAdmin });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Login failed' });
    }
});

app.post('/add-item', async (req, res) => {
    try {
        const { name, price, category, description } = req.body;

        const newItem = new Item({ name, price, category, description });
        await newItem.save()
        res.send('Successfully added item');

    } catch (error) {
        console.error(error);
        res.status(500).send('Failed item');
    }
})


app.post('/basket/add', async (req, res) => {
    try {
        const { userPIN, itemID } = req.body;
        const user = await User.findOne({ userPIN });
        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }
        const itemInBasket = user.basket.find((item) => item.item.toString() === itemID);
        if (itemInBasket) {
            itemInBasket.quantity += 1;
        } else {
            user.basket.push({ item: itemID, quantity: 1 });
        }
        await user.save();
        res.status(200).json({ message: 'Item added to basket' });
    } catch (error) {
        console.error(error);
    }
});

app.get('/basket/:userPIN', async (req, res) => {
    try {
        const user = await User.findOne({ userPIN: req.params.userPIN }).populate('basket.item');
        if (!user) {
            console.log('User not found')
        }
        res.json(user.basket);
    } catch (error) {
        console.error(error);
    }
});

app.post('/basket/remove', async (req, res) => {
    try {
        const { userPIN, itemID } = req.body;
        const user = await User.findOne({ userPIN });
        if (!user) {
            console.log('User not found');
        }
        user.basket = user.basket.filter(basketItem => basketItem.item.toString() !== itemID);
        await user.save();
        res.json({ message: 'Item removed' });
    } catch (error) {
        console.error(error);
    }
})




