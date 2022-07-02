//EXPRESS
const express = require("express");
//COOKIE!
const cookieParser = require("cookie-parser");
//Initialize express
const app = express();
//Just a general PORT
const PORT = 8080; 

//ejs view engine
app.set('view engine', 'ejs');
//start using cookieparser
app.use(cookieParser());

//body parser
const bodyParser = require("body-parser");
//use bodyparser!!
app.use(bodyParser.urlencoded({extended: true}));

//function that generates a random string
const generateRandomString = function () {
  let randomString = '';
  const allCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for(let i = 0; i < 6; i++) {
    randomString += allCharacters.charAt(Math.floor(Math.random() * allCharacters.length));
  }
  return randomString;
}

//THE URLDATABASE
const urlDatabase = {
  "b2xVn2" : "http://www.lighthouselabs.ca",
  "9sm5xk" : "https://www.google.com"
};

//GETS/RENDERS THE URLS PAGE
app.get('/urls', (req, res) => {
  const templateVars = { urls: urlDatabase, username: req.cookies["username"]};
  res.render('urls_index', templateVars);
});

//RENDERS THE URLS/NEW 
app.get("/urls/new", (req, res) => {
  const templateVars = {username: req.cookies["username"]};
  res.render("urls_new", templateVars);
});

//not sure what this is for
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], username: req.cookies["username"]}
  res.render("urls_show", templateVars);
});

//Generating a small url for our new added long url
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);
});

//NOT SURE WHAT THIS IS FOR??
app.get("/u/:shortURL", (req, res) => {
  res.redirect(urlDatabase[req.params.shortURL]);
});

//DELETING A SPECIFIC DATA FROM OUR URLDATABASE
app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect('/urls');
});

//EDITING THE LONG URL 
app.post("/urls/:id", (req, res) => {
  const id = req.params.id;
  const longURL = req.body.longURL
  urlDatabase[id] = longURL;
  res.redirect(`/urls/${id}`);

});

//cookie first one
app.post("/login", (req, res) => {
  res.cookie("username", `${req.body.username}`);
  res.redirect("/urls");
});

//logout and get the cookie cleared
app.post("/logout", (req, res) => {
  res.clearCookie('username');
  res.redirect("/urls");
})

//create a registration form 
app.get("/register", (req, res) => {
  res.render("urls_register");
})

//SERVER IS LISTENING .LISTEN!!! :)
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

