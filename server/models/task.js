var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/todo', { useMongoClient: true });
var Schema = mongoose.Schema;

var taskSchema = new Schema({
  task_name: { type: String, required: true },
  status: Boolean
});

var Task = mongoose.model('Task', taskSchema);

module.exports = Task;
