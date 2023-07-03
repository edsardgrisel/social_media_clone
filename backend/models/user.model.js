const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 5,
    }, 
    password: {
        type: String,
        required: true,
        minlength: 5
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
}, {
  timestamps: true,
});

userSchema.pre('save', function(next) {
    if(this.isModified('password')|| this.isNew()) {
        bcrypt.hash(this.password, 10, (err, hash) => {
            if(err) return next(err);

            this.password = hash;
            next();
        })
    }
})




const User = mongoose.model('User', userSchema);

module.exports = User;