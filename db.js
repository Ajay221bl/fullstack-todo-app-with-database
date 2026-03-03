const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId  = mongoose.ObjectId;

mongoose.connect("mongodb+srv://new_user_1:2oBXLBvhdQ1fwxBm@cluster0.aupokvf.mongodb.net/todo-app-database")
// defining the schema for User
const User = new Schema({
    email : {type: String, unique: true},
    password : String,
    name : String
})

// defining the Schema for Todo
const Todo = new Schema({
    description : String,
    done : Boolean,
    userId : ObjectId
})

// "users" is the collection in which to put the data in mongodb
// User is the schema for that collection
const UserModel  = mongoose.model("users", User)
const TodoModel = mongoose.model("todos", Todo)

module.exports = {
    UserModel : UserModel,
    TodoModel : TodoModel
}