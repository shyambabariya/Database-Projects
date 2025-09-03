// ***********************************************************************
// Require Things 
const express = require("express");
const app = express();
const mysql = require("mysql2");
const { faker } = require("@faker-js/faker");
const path = require("path");
const methodOverride = require("method-override");
const {v4:uuidv4} = require("uuid");

const port = 8080;
app.listen(port, (req, res) => {
  console.log(`Listening on port ${port}`);
});
// ***********************************************************************

// ***********************************************************************
// Setting the things
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "/public")));
// ***********************************************************************

// ***********************************************************************
// Connection with the MySQL using mysql2 Package
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "prac_app",
  password: "root",
});
// ***********************************************************************

// ***********************************************************************
// Testing things ---> Start

// Insert one only
// let q = "INSERT INTO user VALUES (?,?,?,?)" ;
// let user = ["102","theboi","boi@gmail.com","boi@34"];
// *****************************************************************

// insert one or more
// let q = "INSERT INTO user VALUES ?";
// let users = [
//   ["190","raj","raj@132gmail.com","raj#12@1"],
//   ["200","shivam","shivam123@gmail.com","shivam#123"],
// ];
// ****************************************************************

// let randomUser = () => {
//   return [
//     faker.string.uuid(),
//     faker.internet.username(),
//     faker.internet.email(),
//     faker.internet.password(),
//   ];
// };

// Bulk insert users
// let q = "INSERT INTO user VALUES ?";
// let data = [];
// for(let i = 1; i <= 100; i++ ){
//   data.push(randomUser());
// }
// ******************************************************************

// try{
//   connection.query(q,[data], (err,result)=>{
//     if(err) throw err;
//     console.log(result);
//   })
// }catch(err){
//   console.log(err);
// }
// connection.end();

// Testing things -->end
// ***********************************************************************

// ***********************************************************************
// Routing
// Read Route -->Show Count of users
app.get("/", (req,res)=>{
  let q = `SELECT COUNT(*) FROM user`;
  try{
    connection.query(q, (err,result)=>{
      if(err) throw err;
      let totalUser = result[0]["COUNT(*)"];
      res.render("home.ejs",{totalUser});
    });
  }catch(err){
    console.log(err);
  }
});
// ***********************************************************************

// ***********************************************************************
//Read Route --> Show All User Data 
app.get("/user", (req, res) => {
  let q = "SELECT * FROM user";
  try {
    connection.query(q, (err, result) => {
      let count = 1;
      if (err) throw err;
      let data = result;
      res.render("user.ejs", { data, count });
    });
  } catch (err) {
    console.log(err);
  }
});
// ***********************************************************************
// Edit Route --> give the form to the user to edit details
app.get("/user/:id/edit", (req, res) => {
  let { id } = req.params;
  let q = `SELECT * FROM user WHERE id = '${id}'`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      console.log(user);
      res.render("edit.ejs", { user });
    });
  } catch (err) {
    console.log(err);
  }
});
// ***********************************************************************

// ***********************************************************************
// Update Route --> After filling data in edit form this route actual update data in db
app.patch("/user/:id", (req, res) => {
  let { id } = req.params;
  let { username: newUsername, password: formPassword } = req.body;
  let q = `SELECT * FROM user WHERE id = '${id}'`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      if (formPassword === user.password) {
        let q2 = `UPDATE user SET username ='${newUsername}' WHERE id = '${id}'`;
        try {
          connection.query(q2, (err, result) => {
            if (err) throw err;
            console.log(result);
            res.redirect("/user");
          });
        } catch (err) {
          console.log(err);
        }
      } else {
        res.send("Password not matched");
      }
    });
  } catch (err) {
    console.log(err);
  }
});
// ***********************************************************************

// ***********************************************************************
// Create Route --> Creating new User using this route
app.get("/user/new", (req,res)=>{
  res.render("new.ejs");
})
app.post("/user", (req,res)=>{
  let {username, email,password} = req.body;
  let id = uuidv4();
  let q = `INSERT INTO user VALUES ('${id}', '${username}','${email}','${password}')`;
  try{
    connection.query(q, (err,result)=>{
      if(err) throw err;
     res.redirect("/user");
    });
  }catch(err){
    console.log(err);
  }
});
// ***********************************************************************

// ***********************************************************************
// Delete (Destroy) Route --> Delete data from the db
app.delete("/user/:id", (req,res)=>{
  let {id}  = req.params;
  // console.log(id);
  let q = `DELETE FROM user WHERE id='${id}'`;
  try{
    connection.query(q,(err,result)=>{
      if(err)throw err;
      console.log(result);
      res.redirect("/user");
    });
  }catch(err){
    console.log(err);
  }
});
// ***********************************************************************

