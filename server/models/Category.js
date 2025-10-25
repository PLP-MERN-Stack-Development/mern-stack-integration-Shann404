const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    name: {
        type:String,
        required:true,
        unique:true
    },
});

CategorySchema.virtual('posts',{
    ref:'Post',
    localField:'_id',
    foreignField:'category',
});

CategorySchema.set('toObject', { virtuals:true });
CategorySchema.set('toJSON', { virtuals:true });

module.exports = mongoose.model('Category', CategorySchema);