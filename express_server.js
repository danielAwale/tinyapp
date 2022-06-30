const express = require("express");
const app = express();
const PORT = 8080; 


app.set('view engine', 'ejs');

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const generateRandomString = function () {
  let randomString = '';
  const allCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for(let i = 0; i < 6; i++) {
    randomString += allCharacters.charAt(Math.floor(Math.random() * allCharacters.length));
  }
  return randomString;
}


const urlDatabase = {
  "b2xVn2" : "http://www.lighthouselabs.ca",
  "9sm5xk" : "https://www.google.com"
};

app.get('/urls', (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render('urls_index', templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]}
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);
});

app.get("/u/:shortURL", (req, res) => {
  res.redirect(urlDatabase[req.params.shortURL]);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect('/urls');
});

app.post("/urls/:id", (req, res) => {
  const id = req.params.id;
  const longURL = req.body.longURL
  urlDatabase[id] = longURL;
  res.redirect(`/urls/${id}`);

})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

