//Getting dependencies
const http = require("http");
const express = require("express");
const path = require("path");
const fs = require("fs");

//Initializing Express and our PORT
let app = express();
//Getting our index.js file
app.use("/assets", express.static(__dirname + "/assets"));
//Also leaving the logic in for when we deploy to Heroku
let PORT = process.env.PORT || 8080;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Routes

//Home page
app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "index.html"));
});
//Where we take our notes
app.get("/notes", function(req, res) {
  res.sendFile(path.join(__dirname, "notes.html"));
});
// //Where our saved notes live! (For now)
app.get("/api/notes", function(req, res) {
  res.sendFile(path.join(__dirname, "db.json"));
});
//Posting a new note to our "database"
app.post("/api/notes", function(req, res) {
  //Grabbing request information
  let newNote = req.body;
  //Reading db.json to get existing information
  fs.readFile("./db.json", "utf8", function(err, data) {
    if (err) {
      console.log(err);
    }
    //Parsing file
    let parsedData = JSON.parse(data);
    //Giving the note a unique ID number
    newNote.ID = parsedData.length + 1;
    //Pushing new note object from POST request into saved array in db.json
    parsedData.push(newNote);
    console.log(parsedData);
    //Writing newly generated database object to db.json
    fs.writeFile("./db.json", JSON.stringify(parsedData), function(err) {
      if (err) {
        console.log(err);
      } else {
        console.log("File successfully overwritten");
      }
    });
  });

  // console.log(newNote);
});

app.listen(PORT, function() {
  console.log(`Listening at: http://localhost:${PORT}`);
});
