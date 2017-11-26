var mongoose = require('mongoose');
mongoose.connect(`mongodb://vinnixdb:${process.env.PASS_ATLAS}@cluster0-shard-00-00-b8rmh.mongodb.net:27017,cluster0-shard-00-01-b8rmh.mongodb.net:27017,cluster0-shard-00-02-b8rmh.mongodb.net:27017/todo?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin`, { useMongoClient: true });
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
