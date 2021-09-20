require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const path = require('path');
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const app = express();

//const PORT = process.env.PORT || 3000;


app.use(express.static(path.join(__dirname, 'build')));
// app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

//-----------------------------------------------------------SETTING CONNECTION
mongoose.connect(process.env.URL_DB, {useNewUrlParser: true})

const notesSchema = new mongoose.Schema ({
  content: String
});

const Note = new mongoose.model("Note", notesSchema);
//----------------------------------------------------------- CREATING NEW NOTE
const newnote = new Note({
    content: "09/09: This is a new note." });
    newnote.save();
var savedNotes = [];

//----------------------------------------------------------RETRIEVING NOTES FROM DB

Note.find({}, function(err,retrieved){
    if (err) {console.log(err);}
    else     {retrieved.map(note => savedNotes.push(note));
    }
});

//------------------------------------------------LOGIN PAGE----------
const userSchema = new mongoose.Schema ({
  username: String,
  password: String
});

const encryption = "Encriptionrequiredbyme."
//process.env.ENCRYPTION;

userSchema.plugin(encrypt, {secret:encryption, encryptedFields:["password"]});

const User = new mongoose.model("User", userSchema);

app.get('/', function (req, res) {
  res.sendFile(__dirname+"/src/home.html");
});

app.get("/login", function(req,res){
  res.sendFile(__dirname+"/src/login.html");
});

app.get("/register", function(req,res){
  res.sendFile(__dirname+"/src/register.html");
});



app.post("/register", function(req,res){
  const newUser = new User ({
    username: req.body.username,
    password: req.body.password
});
  newUser.save(function(err){
  if (err) {console.log(err);}
  else {
    console.log("User successfully added to database.");
  }});

  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


app.post("/login", function(req,res){
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email: username}, function(err, foundUser){
    if (err) {console.log(err);}
    else {
        if (foundUser) {
          if (foundUser.password === password) {
            res.sendFile(path.join(__dirname, 'build', 'index.html'));
    }}}
  });
});

//-------------------------------------------------------------------GET REQUEST
// app.get("/", function(req, res) {
//     res.render("todolist", {renderedNotes: savedNotes});
// });
// //---------------------------------------------------------------------POST REQUEST
// app.post("/", function(req,res){
//     const newContent = req.body.content;
//     const newNote = new Note ({
//         content: newContent
//     });
//     newNote.save();
//     res.redirect("/");
// });
//-------------------------------------------------------------------------- SERVER CONN

app.listen(3000, function() {
    console.log("Server started successfully.");
  });
