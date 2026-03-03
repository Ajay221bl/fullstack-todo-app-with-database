const express = require("express");
const app = express();
const bcrypt = require('bcrypt');

const jwt = require("jsonwebtoken");
const JWT_SECRET = "hellokitty";



// importing code from db.js file
const {UserModel, TodoModel} = require("./db")

//using the json parser of express library
app.use(express.json());


// sending index.html file from backend
app.get("/", (req, res)=>{
    res.sendFile(__dirname + "/public/index.html")
})
// authentication handler
function authentication(req, res, next){
    const token = req.headers["authorization"];
    const decoded_token = jwt.verify(token, JWT_SECRET);
    if(decoded_token){
        const id = decoded_token.id;
        req.userId = id;
        next()
    }else{
        res.status(403).json({
            message : "incorrect credentials"})
    }
    
}

// signup handler
 app.post("/signup", async (req, res)=>{
    const name = req.body.name;
    const password = req.body.password;
    const email = req.body.email;
    
    // calling the asynchronous insert method of
    // model class.
    //It talks to the database and check if this user
    // already exists or not and then inserts if doesnt exist

    const foundUser = await UserModel.findOne({
        email : email
    })

    const hashedPassword = await bcrypt.hash(password, 4 );
    console.log(hashedPassword);
    if(!foundUser){
        const user= await UserModel.create({
        email : email,
        password : password,
        name : name
    })
  

    res.status(200).json({
        message: "You are signed up!"
    });

}else{
    res.json({
        message: "Email already exists!"
    })
    
}
});
    
    

// login handler
app.post("/login", async (req, res)=>{
    const email = req.body.email;
    const password = req.body.password;

    const user = await UserModel.findOne({
        email : email,
        password : password
    })
    console.log(user)

    if(user){
        const token = jwt.sign({
            //using user's unique id to create jwt (because its unique for every user)
            id : user._id
        }, JWT_SECRET)

        res.json({
            message: "you are logged in!",
            token : token
        })
    }else{
        res.status(403).json({
            message : "user doesn't exist!"
        })
    }


})


// "authenticated" todo post request handler
app.post("/todo",authentication, async (req, res)=>{
    const userId = req.userId;
    const description = req.body.description;
    const done = req.body.done;
    const user = await UserModel.findOne({
        _id : userId
    })
    if(user){
        const todo = await TodoModel.create({
            description : description,
            done : done,
            userId : userId
        })
        console.log(todo)
        res.json({
            message: "todo added"
        })
    }


})

// "authenticated" todo get request handler
app.get("/todo", authentication, async (req, res)=>{
    const userId = req.userId;
    const user = await UserModel.findOne({
        _id : userId
    })
    if(user){
        const todos = await TodoModel.find({
            userId : userId
        })
        res.json({
            todos : todos
        })
    }

})



app.listen(3000);
