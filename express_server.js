//EXPRESS
const express = require("express");
//COOKIE!
const cookieSession = require('cookie-session')
//Initialize express
const app = express();
//Just a general PORT
const PORT = 3000; 
// bcrypt hashing passwords
const bcrypt = require('bcryptjs');

//ejs view engine
app.set('view engine', 'ejs');
//start using cookiesession
app.use(cookieSession({
  name: 'session',
  keys: ["42964prov2392"],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

//body parser
const bodyParser = require("body-parser");
//use bodyparser!!
app.use(bodyParser.urlencoded({extended: true}));

const { generateRandomString, compareEmail, findUserID, urlsForUser, getUserByEmail } = require("./helpers")

//THE URLDATABASE
const urlDatabase = {};

//the user object
const users = {}

//GETS/RENDERS THE URLS PAGE
app.get('/urls', (req, res) => {
  const templateVars = { urls: urlsForUser(req.session.user_id, urlDatabase), user: users[req.session.user_id]};
  res.render('urls_index', templateVars);
});

//RENDERS THE URLS/NEW 
app.get("/urls/new", (req, res) => {
  const templateVars = {user: users[req.session.user_id]};
  if (!users[req.session.user_id]) {
    res.redirect("/login");
  } else {
    res.render("urls_new", templateVars);

  }
});

//not sure what this is for
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL, user: users[req.session.user_id]}
  res.render("urls_show", templateVars);
});

//Generating a small url for our new added long url
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = { longURL: req.body.longURL , userID: req.session.user_id};
  res.redirect(`/urls/${shortURL}`);
});

//to get to the website through the shortURL
app.get("/u/:shortURL", (req, res) => {
  if(!urlDatabase[req.params.shortURL]) {
    res.status(404).send("This shortURL does not exist yet!")
  } else {
  res.redirect(urlDatabase[req.params.shortURL]["longURL"]);
  }
});

//DELETING A SPECIFIC DATA FROM OUR URLDATABASE
app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  urlDatabase[shortURL] = { longURL: req.body.longURL , userID: req.session.user_id};
  if(urlDatabase[shortURL].userID) {
  delete urlDatabase[shortURL];
  res.redirect('/urls');
  } else {
    res.status(404).send("You are not authorized to delete this url");
  }
});

//EDITING THE LONG URL 
app.post("/urls/:id", (req, res) => {
  const id = req.params.id;
  const longURL = req.body.longURL
  urlDatabase[id]["longURL"] = longURL;
  res.redirect(`/urls/${id}`);

  

});

// app.post for loggin in
app.post("/login", (req, res) => {
  const emailEntered = req.body.email;
  const passwordEntered = req.body.password;
  const userID = findUserID(users, emailEntered);
  let currentUser = false;
  if(!getUserByEmail(users, emailEntered)) {
    res.status(403).send("email entered cannot be verified");
  } else if(getUserByEmail(users, emailEntered) && !bcrypt.compareSync(passwordEntered, users[userID].password)) {
    res.status(403).send("password entered is incorrent!");
  } else if(getUserByEmail(users, emailEntered) && bcrypt.compareSync(passwordEntered, users[userID].password)) {
    currentUser = true;
  }
    req.session.user_id = userID;
    res.redirect("/urls"); 
})

//logout and get the cookie cleared
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
})

//get a registration form 
app.get("/register", (req, res) => {
  templateVars = {user : users[req.session.user_id]};
  res.render("urls_register" , templateVars);
})

//register a user
app.post("/register", (req, res) => {
  const id = generateRandomString();
  const email = req.body.email;
  const password = req.body.password;
  if(!email && !password) {
    res.status(400).send("Email and Password fields cannot be empty! Please enter an email and password to register");
  } else if (getUserByEmail(users, email)){
    res.status(400).send("This email is already in use!");
  } else {
  users[id] = {
    id,
    email, 
    password: bcrypt.hashSync(password, 10),
  }}
  console.log(users);
  req.session.user_id = id;
  res.redirect("/urls");
} 
);

//new login page get!
app.get("/login", (req, res) => {
  const templateVars = {user: users[req.session.user_id]};
  res.render("urls_login", templateVars);
})

//SERVER IS LISTENING .LISTEN!!! :)
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

