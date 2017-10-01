var mongoose=require('mongoose');
mongoose.connection.openUri('mongodb://localhost:27017/Tododb');
var mongoSchema=mongoose.Schema;
var tasksSchema={"status":Array,"Created_date" : Date};
module.exports=mongoose.model('tasksSchema',tasksSchema,'tasks');