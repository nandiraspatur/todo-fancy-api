var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/todo', { useMongoClient: true });
var Schema = mongoose.Schema;

var userSchema = new Schema({
  username: { type: String, index: { unique: true }, required: true },
  password: { type: String, required: true },
  firstname: { type: String, default: '' },
  lastname: { type: String, default: '' },
  email: { type: String, default: '' },
  id_facebook: { type: String, default: null },
  task_list: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task'
    }]
});

var User = mongoose.model('User', userSchema);

module.exports = User;
