const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema({
      name: {
            type: String,
            required: [true, 'Please add a subcategory name'],
            trim: true,
      },
      category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: [true, 'Please specify the parent category'],
      },
      image: {
            type: String,
            default: 'https://via.placeholder.com/150',
      },
      status: {
            type: String,
            enum: ['active', 'inactive'],
            default: 'active',
      },
}, {
      timestamps: true,
});

module.exports = mongoose.model('SubCategory', subCategorySchema);
