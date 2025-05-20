const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: mongoose.Schema.Types.Decimal128, get: value => parseFloat(value.toString()), required: true },
    category: { type: String, required: true },
    description: {type: String, required: true}
});
itemSchema.set('toJSON', {getters: true});
module.exports = mongoose.model('Item', itemSchema);