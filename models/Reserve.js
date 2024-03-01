const mongoose = require('mongoose');
const Restaurant = require('./Restaurant');

const ReserveSchema = new mongoose.Schema({
    apptDate: {
        type: Date,
        require:true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref:'User',
        require:true
    },
    restaurant: {
        type: mongoose.Schema.ObjectId,
        ref: 'Restaurant',
        require: true
    },
    createAt: {
        type: Date,
        default: Date.now
    }
});

module.exports=mongoose.model('Reserve',ReserveSchema);