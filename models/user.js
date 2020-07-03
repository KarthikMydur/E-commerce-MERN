const mongoose = require("mongoose");
const crypto = require("crypto");
const uuidv1 = require("uuid/v1");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 32,
        trim: true
    },
    lastname: {
        type: String,
        maxlength: 32,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    userInfo: {
        type: String,
        trim: true
    },
    encry_password:  {
        type: String,
        required: true
    },
    salt: String,
    role: {
        type: Number,
        default: 0
    },
    purchases: {
        type: Array,
        default: []
    }
}, { timestamp: true })

userSchema.virtual("password")
    .set(function(password) {
        this._password = password;
        this.salt = uuidv1();
        this.encry_password = this.securedPassword(password);
    })
    .get(function() {
        return this._password;
    })

userSchema.method = {

    authenticate: function(plainPassword) {
        return this.securedPassword(plainPassword) === this.encry_password;
    },

    securedPassword: function(plainPassword) {
        if (!password) return "";
        try {
            return crypto
                .createHmac("sha256", this.salt)
                .update(plainPassword)
                .digest("hex")
        } catch (err) {
            return "";
        }
    }
}

module.exports = mongoose.model("User", userSchema );