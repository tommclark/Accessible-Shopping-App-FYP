const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    userPIN: {type: String, required: true, unique: true},
    password: {type: String, required: true, unique: true}
});

userSchema.pre('save', async function (next) {
    if(!this.isModified('password')) return next(); // Password is only hashed when it is changed or new
    const saltRounds = 10
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();

});

userSchema.methods.comparePassword = async function(providedPassword) {
    return bcrypt.compare(providedPassword, this.password);

};

module.exports = mongoose.model('User', userSchema);