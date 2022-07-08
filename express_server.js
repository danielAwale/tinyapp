//EXPRESS
const express = require("express");
//COOKIE!
const cookieSession = require('cookie-session');
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
}));

//body parser
const bodyParser = require("body-parser");
//use bodyparser!!
app.use(bodyParser.urlencoded({extended: true}));

//HELPER FUNCTION
const { generateRandomString, findUserID, urlsForUser, getUserByEmail } = require("./helpers");

//THE URLDATABASE
const urlDatabase = {};

//the user object
const users = {};

//RENDERS THE HOME PAGE
app.get('/', (req,res) => {
  const templateVars = { urls: urlsForUser(req.session.user_id, urlDatabase), user: users[req.session.user_id]};
  res.render('urls_index', templateVars);
});

//RENDERS THE URLS PAGE
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

//RENDER THE SHORT URL PAGE
app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  if (urlDatabase[shortURL] && urlDatabase[shortURL].userID === req.session.user_id) {
    const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL, user: users[req.session.user_id] };
    res.render("urls_show", templateVars);
  } else {
    res.status(404).send("You are not authorized to edit this url");
  }
  return;
});

//GETTING TO THE WEBSITE THROUGH THE SHORT URL
app.get("/u/:shortURL", (req, res) => {
  if (!urlDatabase[req.params.shortURL]) {
    res.status(404).send("This shortURL does not exist yet!");
  } else {
    res.redirect(urlDatabase[req.params.shortURL]["longURL"]);
  }
});

// RENDER THE REGISTRATION PAGE
app.get("/register", (req, res) => {
  const templateVars = {user : users[req.session.user_id]};
  res.render("urls_register" , templateVars);
});

//RENDERS THE LOGIN PAGE
app.get("/login", (req, res) => {
  const templateVars = {user: users[req.session.user_id]};
  res.render("urls_login", templateVars);
});


//GENERATING A SMALL URL FOR LONGURL
app.post("/urls", (req, res) => {
  if (req.session.user_id) {
    const shortURL = generateRandomString(6);
    urlDatabase[shortURL] = { longURL: req.body.longURL , userID: req.session.user_id};
    res.redirect(`/urls/${shortURL}`);
  } else {
    res.status(404).send("you need to register or login to use this service!");
  }
});

//DELETING DATA FROM URLDATABASE
app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  urlDatabase[shortURL] = { longURL: req.body.longURL , userID: req.session.user_id};
  if (urlDatabase[shortURL].userID === req.session.user_id) {
    delete urlDatabase[shortURL];
    res.redirect('/urls');
  } else {
    res.status(404).send("You are not authorized to delete this url");
  }
});

//EDITING THE LONG URL
app.post("/urls/:id", (req, res) => {
  const id = req.params.id;
  if (urlDatabase[id] && urlDatabase[id]["userID"] === req.session.user_id) {
    const longURL = req.body.longURL;
    urlDatabase[id]["longURL"] = longURL;
    res.redirect(`/urls/${id}`);
  } else {
    res.status(404).send("You are not authorized to edit this url");
  }
});


// FOR LOGGING IN
app.post("/login", (req, res) => {
  const emailEntered = req.body.email;
  const passwordEntered = req.body.password;
  const userID = findUserID(users, emailEntered);
  if (!getUserByEmail(users, emailEntered)) {
    res.status(403).send("email entered cannot be verified");
  } else if (getUserByEmail(users, emailEntered) && !bcrypt.compareSync(passwordEntered, users[userID].password)) {
    res.status(403).send("password entered is incorrent!");
  } else if (getUserByEmail(users, emailEntered) && bcrypt.compareSync(passwordEntered, users[userID].password)) 
    req.session.user_id = userID;
  res.redirect("/urls");
});

//LOGOUT
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});

//REGISTERING USER
app.post("/register", (req, res) => {
  const id = generateRandomString(6);
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    res.status(400).send("Email and Password fields cannot be empty! Please enter an email and password to register");
  } else if (getUserByEmail(users, email)) {
    res.status(400).send("This email is already in use!");
  } else {
    users[id] = {
      id,
      email,
      password: bcrypt.hashSync(password, 10),
    };
  }
  req.session.user_id = id;
  res.redirect("/urls");
  console.log(users);
}
);

//SERVER IS LISTENING
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


