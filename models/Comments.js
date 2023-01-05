const mongoose = require('mongoose');
const { Schema } = mongoose;
mongoose.Promise = global.Promise;

const commentsSchema = new Schema({
  username: {
    type: String
  },  
  comment: {
    type: String
    // required: true
  },
  recipeId: {
    type: String
    // required: true,
  },
  date: {
    type: String
    // required: false
  },
  userProfileImg: {
    type: String
  }

});

commentsSchema.set('timestamps', true);

module.exports = mongoose.models.Comments || mongoose.model('Comments', commentsSchema);