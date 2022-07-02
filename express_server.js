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

//the user object
const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}

//GETS/RENDERS THE URLS PAGE
app.get('/urls', (req, res) => {
  const templateVars = { urls: urlDatabase, user: users[req.cookies["user_id"]]};
  res.render('urls_index', templateVars);
});

//RENDERS THE URLS/NEW 
app.get("/urls/new", (req, res) => {
  const templateVars = {user: users[req.cookies["user_id"]]};
  res.render("urls_new", templateVars);
});

//not sure what this is for
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], user: users[req.cookies["user_id"]]}
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

// //cookie first one
// app.post("/login", (req, res) => {
//   res.cookie("user_id", user);
//   res.redirect("/urls");
// });

//logout and get the cookie cleared
app.post("/logout", (req, res) => {
  res.clearCookie('user_id');
  res.redirect("/urls");
})

//get a registration form 
app.get("/register", (req, res) => {
  res.render("urls_register");
})

//function that will take two parameters and will compare 
const compareEmail = function(emailOnTheDatabase, emailPassed) {
  for (let emails in emailOnTheDatabase) {
  if(emailOnTheDatabase[emails].email === emailPassed) {
    return true;
  } 
}
}

//register a user
app.post("/register", (req, res) => {
  const id = generateRandomString();
  const email = req.body.email;
  const password = req.body.password;
  if(!email && !password) {
    res.status(400).send("Email and Password fields cannot be empty! Please enter an email and password to register");
  } else if (compareEmail(users, email)){
    res.status(400).send("This email is already in use!");
  } else {
  users[id] = {
    id,
    email, 
    password,
  }}
  res.cookie("user_id", id);
  res.redirect("/urls");

}
);

//SERVER IS LISTENING .LISTEN!!! :)
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

