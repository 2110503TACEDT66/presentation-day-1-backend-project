const mongoose = require('mongoose');

const RestaurantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true,'Please add a name'],
        unique: true,
        trim:true,
        maxlength:[50,'Name can not be more than 50 characters']
    },
    address:{
        type: String,
        required: [true,'Please add an address']
    },
    district:{
        type: String,
        required: [true,'Please add an address']
    },
    province:{
        type: String,
        required: [true,'Please add a province']
    },
    postalcode:{
        type: String,
        required: [true,'Please add a postalcode'],
        maxlength: [5,'Postal Code can not be more than 5 digits']
    },
    tel:{
        type: String,
        required: [true,'Please add a region']
    },
    region:{
        type: String,
        required: [true,'Please add region'],
    },
    openingHours: [ {
            type: Map,
            enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            of: {
                opens: { type: String, required: true },
                closes: { type: String, required: true }
            }
        
    }
    // dayOfWeek: { type: String, required: true , enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] },
    // opens: { type: String, required: true },
    // closes: { type: String, required: true }
 
        
    ]
},{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
});

RestaurantSchema.pre('deleteOne',{document:true,query: false}, async function(next) {
    console.log(`Reserves being remove from restaurant ${this._id}`);
    await this.model('Reserve').deleteMany({restaurant: this._id});
    next();
});

RestaurantSchema.virtual('reserves',{
    ref:'Reserve',
    localField: '_id',
    foreignField:'restaurant',
    justOne: false
});
module.exports = mongoose.model('Restaurant',RestaurantSchema);
