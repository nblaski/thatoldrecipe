const mongoose = require('mongoose');
const { Schema } = mongoose;
mongoose.Promise = global.Promise;

const recipeSchema = new Schema({
  recipeName: {
    type: String
    // required: true
  },
  author: {
    type: String
    // required: true,
  },
  allergens: {
    type: Array
    // required: false
  },
  ingredients: {
    type: Array
    // required: false
  },
  stepName: {
    type: Array
    // required: true
  },
  amount: {
    type: Array
    // required: true
  },
  imageName: {
    type: String
  },
  category: {
    type: Array
  },
  servings: {
    type: String
  },
  time: {
    type: String
  },
  subCategory: {
    type: Array
  }
});

// recipeSchema.virtual('/img').get(function() {
//   if (this.coverImage != null && this.coverImageType != null) {
//     return `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString('base64')}`
//   }
// })

// recipeSchema.virtual('coverImagePath').get(function() {
//     if (this.coverImageName != null) {
//       return path.join('/', coverImageBasePath, this.coverImageName)
//     }
//   })

recipeSchema.set('timestamps', true);

module.exports = mongoose.models.Recipe || mongoose.model('Recipe', recipeSchema);