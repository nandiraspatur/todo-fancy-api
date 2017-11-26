var mongoose = require('mongoose');
mongoose.connect(`mongodb://vinnixdb:${process.env.PASS_ATLAS}@cluster0-shard-00-00-b8rmh.mongodb.net:27017,cluster0-shard-00-01-b8rmh.mongodb.net:27017,cluster0-shard-00-02-b8rmh.mongodb.net:27017/todo?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin`, { useMongoClient: true });
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
