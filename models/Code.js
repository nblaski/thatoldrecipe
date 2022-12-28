const mongoose = require('mongoose');
const { Schema } = mongoose;
mongoose.Promise = global.Promise;

const codeSchema = new Schema({
  codeName: {
    type: String,
  },
  code: {
    type: String
    // required: true
  }
});


// codeSchema.set('timestamps', true);

const Code = mongoose.model('Code', codeSchema);


module.exports = Code;