const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
}, { versionKey: false });

const User = mongoose.model("User", UserSchema);


const ExerciseSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    description: {
        type: String,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
}, { versionKey: false });

const Exercise = mongoose.model("Exercise", ExerciseSchema);

module.exports = { User, Exercise }