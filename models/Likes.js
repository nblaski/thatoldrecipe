const mongoose = require('mongoose');
const { Schema } = mongoose;
mongoose.Promise = global.Promise;

const likesSchema = new Schema({
  username: {
    type: String
  },  
  likesNum: {
    type: number
    // required: true
  },
  recipeId: {
    type: String
    // required: true,
  }
});

likesSchema.set('timestamps', true);

module.exports = mongoose.models.Likes || mongoose.model('Likes', likesSchema);