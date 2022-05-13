const mongoose = require('mongoose');
  
const imageSchema = new mongoose.Schema({
    name: String,
    // desc: String,
    img:
    {
        data: Buffer,
        contentType: String
    }
});
  
const recipeSchema = new mongoose.Schema({
    recipeName: {
      type: String,
      required: false
    },
    Author: {
      type: String,
      required: false,
    },
    allergens: {
      type: Array,
      required: false
    },
    ingredients: {
      type: Array,
    },
    stepName: {
      type: Array,
      required: false
    },
    stepDescription: {
      type: Array,
      required: false
    },
    imageName: {
        type: String,
        required: false
    },
    imageR:
    {
        data: Buffer,
        contentType: String
    }
  });
  
recipeSchema.set('timestamps', true);
imageSchema.set('timestamps', true);


const Image = new mongoose.model('Image', imageSchema);
const Recipe = new mongoose.model('Recipe', recipeSchema);

module.exports = {
    Image,
    Recipe
};