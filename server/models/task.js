var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/todo', { useMongoClient: true });
var Schema = mongoose.Schema;

var taskSchema = new Schema({
  user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
  task_name: { type: String, required: true },
  status: { type: Boolean, default: false}
});

var Task = mongoose.model('Task', taskSchema);

module.exports = Task;
