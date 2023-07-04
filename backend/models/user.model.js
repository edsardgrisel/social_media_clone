const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
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

userSchema.statics.signup = async (username, password, email) => {
    const emailExists = await this.findOne(username);
    const usernameExists = await this.findOne(username);

    if(emailExists) {
        throw Error('Email already associated with an account!');
    } 
    if (usernameExists) {
        throw Error('Username already taken!');
    }

    const user = await this.create({username, password, email});

    return user;


}

// userSchema.methods.checkPassword = async function (password) {
//     if(!password) {
//         throw new Error("Password not found!");
//     }
//     try {
//         await bcrypt.compare(password, this.password);
//     } catch (error) {
//         console.log("Error while checking password: " + error);
//     }
// }


const User = mongoose.model('User', userSchema);

module.exports = User;