const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userPIN: { type: String, required: true },
    items: [{
        item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
        quantity: { type: Number, default: 1 }
    }]
}, { timestamps: true })

module.exports = mongoose.model('Order', orderSchema);